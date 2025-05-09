
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'zenoscale_admin',
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database tables
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create admin users table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create API config table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS api_config (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// Check if first user exists
app.get('/api/admin/check-first-user', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM admin_users');
    connection.release();
    
    const isFirstUser = rows[0].count === 0;
    res.json({ isFirstUser });
  } catch (error) {
    console.error('Error checking first user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register first admin user
app.post('/api/admin/register-first', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if any user exists
    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT COUNT(*) as count FROM admin_users');
    
    if (users[0].count > 0) {
      connection.release();
      return res.status(403).json({ message: 'Admin user already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const [result] = await connection.query(
      'INSERT INTO admin_users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    connection.release();
    
    // Generate token
    const token = jwt.sign(
      { id: result.insertId, username, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.insertId,
        username,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM admin_users WHERE email = ?',
      [email]
    );
    connection.release();
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
app.get('/api/admin/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

// ctrlpanel.gg API integration
const ctrlPanelApiClient = axios.create({
  baseURL: 'https://api.ctrlpanel.gg/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure ctrlpanel API key
app.post('/api/admin/config/ctrlpanel', authenticateToken, async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    // Test the API key
    try {
      await ctrlPanelApiClient.get('/servers', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
    } catch (apiError) {
      return res.status(400).json({ message: 'Invalid API key' });
    }
    
    // Store API key in database
    const connection = await pool.getConnection();
    await connection.query(
      'REPLACE INTO api_config (name, value) VALUES (?, ?)',
      ['ctrlpanel_api_key', apiKey]
    );
    connection.release();
    
    res.json({ message: 'API key configured successfully' });
  } catch (error) {
    console.error('Error configuring API key:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ctrlpanel servers count
app.get('/api/ctrlpanel/servers/count', authenticateToken, async (req, res) => {
  try {
    // Get API key from database
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT value FROM api_config WHERE name = ?',
      ['ctrlpanel_api_key']
    );
    connection.release();
    
    if (rows.length === 0) {
      return res.status(400).json({ message: 'API key not configured' });
    }
    
    const apiKey = rows[0].value;
    
    // Call ctrlpanel API
    const response = await ctrlPanelApiClient.get('/servers', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    
    res.json({ count: response.data.length });
  } catch (error) {
    console.error('Error getting servers count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ctrlpanel users count
app.get('/api/ctrlpanel/users/count', authenticateToken, async (req, res) => {
  try {
    // Get API key from database
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT value FROM api_config WHERE name = ?',
      ['ctrlpanel_api_key']
    );
    connection.release();
    
    if (rows.length === 0) {
      return res.status(400).json({ message: 'API key not configured' });
    }
    
    const apiKey = rows[0].value;
    
    // Call ctrlpanel API
    const response = await ctrlPanelApiClient.get('/users', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    
    res.json({ count: response.data.length });
  } catch (error) {
    console.error('Error getting users count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ctrlpanel server stats
app.get('/api/ctrlpanel/servers/stats', authenticateToken, async (req, res) => {
  try {
    // Get API key from database
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT value FROM api_config WHERE name = ?',
      ['ctrlpanel_api_key']
    );
    connection.release();
    
    if (rows.length === 0) {
      return res.status(400).json({ message: 'API key not configured' });
    }
    
    const apiKey = rows[0].value;
    
    // Call ctrlpanel API
    const response = await ctrlPanelApiClient.get('/servers', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    
    // Calculate stats
    let active = 0;
    let offline = 0;
    
    response.data.forEach(server => {
      if (server.status === 'online' || server.status === 'active') {
        active++;
      } else {
        offline++;
      }
    });
    
    res.json({ active, offline });
  } catch (error) {
    console.error('Error getting server stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Start server
async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
