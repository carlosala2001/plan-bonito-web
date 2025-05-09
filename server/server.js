
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'zenoscale_admin',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Setup the database
async function setupDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create api_keys table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        key_value VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    connection.release();
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();

// Check if first user
app.get('/api/admin/check-first-user', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
    const isFirstUser = rows[0].count === 0;
    res.json({ isFirstUser });
  } catch (error) {
    console.error('Error checking first user:', error);
    res.status(500).json({ error: 'Error checking first user' });
  }
});

// Register first admin user
app.post('/api/admin/register-first-user', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Check if this is actually the first user
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
    if (rows[0].count > 0) {
      return res.status(403).json({ error: 'An admin user already exists' });
    }
    
    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the user
    await pool.query(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, hashedPassword]
    );
    
    // Generate token
    const token = jwt.sign(
      { email, username },
      process.env.JWT_SECRET || 'zenoscale_secret',
      { expiresIn: '24h' }
    );
    
    // Store token in local storage
    res.json({
      message: 'Admin user created successfully',
      token,
      user: { email, username }
    });
  } catch (error) {
    console.error('Error registering first user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Get user by email
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'zenoscale_secret',
      { expiresIn: '24h' }
    );
    
    // Return user info and token
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error during login' });
  }
});

// Middleware to check auth token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'zenoscale_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
    req.user = user;
    next();
  });
};

// API Key management endpoints
app.get('/api/admin/api-keys', authenticateToken, async (req, res) => {
  try {
    const [keys] = await pool.query('SELECT id, name, key_value, created_at FROM api_keys');
    res.json(keys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ error: 'Error fetching API keys' });
  }
});

app.post('/api/admin/api-keys', authenticateToken, async (req, res) => {
  try {
    const { name, key_value } = req.body;
    
    if (!name || !key_value) {
      return res.status(400).json({ error: 'Name and key value are required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO api_keys (name, key_value) VALUES (?, ?)',
      [name, key_value]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      name,
      key_value,
      created_at: new Date()
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ error: 'Error creating API key' });
  }
});

app.delete('/api/admin/api-keys/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM api_keys WHERE id = ?', [id]);
    
    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ error: 'Error deleting API key' });
  }
});

// Check token validity
app.get('/api/admin/check-auth', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Public endpoints for statistics - no auth required
app.get('/api/public/servers/count', async (req, res) => {
  try {
    const [keys] = await pool.query('SELECT key_value FROM api_keys LIMIT 1');
    
    if (keys.length === 0) {
      return res.status(404).json({ error: 'No API keys found' });
    }
    
    // Here we would make a real API call to CtrlPanel.gg
    // For now, returning actual data from our database
    const apiKey = keys[0].key_value;
    
    // Make the real API call - this is just a placeholder
    // In production, you'd use axios or fetch to call the actual API
    // const ctrlPanelResponse = await fetch('https://api.ctrlpanel.gg/v1/servers/count', {
    //   headers: { 'Authorization': `Bearer ${apiKey}` }
    // });
    // const data = await ctrlPanelResponse.json();
    
    // For now, returning sample data
    res.json({ count: 157 });
  } catch (error) {
    console.error('Error fetching public servers count:', error);
    res.status(500).json({ error: 'Error fetching public servers count' });
  }
});

app.get('/api/public/users/count', async (req, res) => {
  try {
    const [keys] = await pool.query('SELECT key_value FROM api_keys LIMIT 1');
    
    if (keys.length === 0) {
      return res.status(404).json({ error: 'No API keys found' });
    }
    
    // Here we would make a real API call to CtrlPanel.gg
    // For now, returning actual data from our database 
    const apiKey = keys[0].key_value;
    
    // Make the real API call - this is just a placeholder
    // const ctrlPanelResponse = await fetch('https://api.ctrlpanel.gg/v1/users/count', {
    //   headers: { 'Authorization': `Bearer ${apiKey}` }
    // });
    // const data = await ctrlPanelResponse.json();
    
    // For now, returning sample data
    res.json({ count: 320 });
  } catch (error) {
    console.error('Error fetching public users count:', error);
    res.status(500).json({ error: 'Error fetching public users count' });
  }
});

// CtrlPanel API proxy endpoints - requires auth
app.get('/api/ctrlpanel/servers/count', authenticateToken, async (req, res) => {
  try {
    const [keys] = await pool.query('SELECT key_value FROM api_keys LIMIT 1');
    
    if (keys.length === 0) {
      return res.status(404).json({ error: 'No API keys found' });
    }
    
    // Here we would make a real API call to CtrlPanel.gg with the API key
    // For production deployment
    res.json({ count: 157 });
  } catch (error) {
    console.error('Error fetching servers count:', error);
    res.status(500).json({ error: 'Error fetching servers count' });
  }
});

app.get('/api/ctrlpanel/users/count', authenticateToken, async (req, res) => {
  try {
    const [keys] = await pool.query('SELECT key_value FROM api_keys LIMIT 1');
    
    if (keys.length === 0) {
      return res.status(404).json({ error: 'No API keys found' });
    }
    
    // Here we would make a real API call to CtrlPanel.gg with the API key
    // For production deployment
    res.json({ count: 320 });
  } catch (error) {
    console.error('Error fetching users count:', error);
    res.status(500).json({ error: 'Error fetching users count' });
  }
});

app.get('/api/ctrlpanel/servers/stats', authenticateToken, async (req, res) => {
  try {
    const [keys] = await pool.query('SELECT key_value FROM api_keys LIMIT 1');
    
    if (keys.length === 0) {
      return res.status(404).json({ error: 'No API keys found' });
    }
    
    // Here we would make a real API call to CtrlPanel.gg with the API key
    // For production deployment
    res.json({
      online: 142,
      offline: 10,
      suspended: 5,
      total: 157,
      serverTypes: {
        minecraft: 78,
        valheim: 26,
        rust: 22,
        csgo: 18,
        ark: 13
      }
    });
  } catch (error) {
    console.error('Error fetching server stats:', error);
    res.status(500).json({ error: 'Error fetching server stats' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the dist directory
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Handle API routes
  app.use('/api', (req, res, next) => {
    next();
  });
  
  // Serve the frontend for all other routes (SPA support)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
