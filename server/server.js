const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, './.env') });

console.log('Server starting with configuration:');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.PORT || 3001);
console.log('Database:', process.env.DB_NAME);
console.log('User:', process.env.DB_USER);

const app = express();
const PORT = process.env.PORT || 3001;

// Configure file upload storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
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
    console.log('Attempting to connect to database...');
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    
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
    
    // Create nodes table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS nodes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        status VARCHAR(20) DEFAULT 'unknown',
        last_check TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create hetrixtools_settings table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hetrixtools_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        api_key VARCHAR(255) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `);
    
    // Create ctrlpanel_settings table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ctrlpanel_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        api_key VARCHAR(255) NOT NULL,
        api_url VARCHAR(255) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `);
    
    // Create zoho_mail_settings table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS zoho_mail_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        host VARCHAR(255) NOT NULL,
        port INT NOT NULL,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        from_email VARCHAR(255) NOT NULL,
        from_name VARCHAR(255) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `);
    
    // Create newsletter_subscribers table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        unsubscribe_token VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create plans table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('hosting', 'vps', 'metal') NOT NULL,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        cpu_value VARCHAR(50) NOT NULL,
        cpu_unit VARCHAR(50) NOT NULL,
        ram_value INT NOT NULL,
        ram_unit VARCHAR(10) NOT NULL,
        disk_value INT NOT NULL,
        disk_unit VARCHAR(10) NOT NULL,
        backups INT NOT NULL DEFAULT 0,
        databases INT NOT NULL DEFAULT 0,
        ports INT NOT NULL DEFAULT 0,
        billing VARCHAR(50) NOT NULL DEFAULT 'por Mes',
        min_credits INT NOT NULL DEFAULT 0,
        ideal_for VARCHAR(255),
        perfect_for VARCHAR(255),
        highlight BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create pages table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        content LONGTEXT NOT NULL,
        is_published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create supported_games table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS supported_games (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        logo_path VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Import existing plans if the plans table is empty
    const [plansCount] = await connection.query('SELECT COUNT(*) as count FROM plans');
    if (plansCount[0].count === 0) {
      try {
        const plansDataPath = path.join(__dirname, '../src/data/plans.ts');
        let plansContent = '';
        if (fs.existsSync(plansDataPath)) {
          plansContent = fs.readFileSync(plansDataPath, 'utf8');
          const planMatches = plansContent.match(/\{\s*name:\s*["'](.+?)["'],\s*price:\s*([\d\.]+),\s*resources:\s*\{\s*cpu:\s*\{\s*value:\s*["'](.+?)["'],\s*unit:\s*["'](.+?)["']\s*\},\s*ram:\s*\{\s*value:\s*([\d]+),\s*unit:\s*["'](.+?)["']\s*\},\s*disk:\s*\{\s*value:\s*([\d]+),\s*unit:\s*["'](.+?)["']\s*\},\s*backups:\s*([\d]+),\s*databases:\s*([\d]+),\s*ports:\s*([\d]+)\s*\},\s*billing:\s*["'](.+?)["'],\s*minCredits:\s*([\d]+),\s*description:\s*\{\s*idealFor:\s*["'](.+?)["'],\s*perfectFor:\s*["'](.+?)["']\s*\}(?:,\s*highlight:\s*(true|false))?\s*\}/g);
          
          if (planMatches) {
            for (let i = 0; i < planMatches.length; i++) {
              const planMatch = plansContent.match(/\{\s*name:\s*["'](.+?)["'],\s*price:\s*([\d\.]+),\s*resources:\s*\{\s*cpu:\s*\{\s*value:\s*["'](.+?)["'],\s*unit:\s*["'](.+?)["']\s*\},\s*ram:\s*\{\s*value:\s*([\d]+),\s*unit:\s*["'](.+?)["']\s*\},\s*disk:\s*\{\s*value:\s*([\d]+),\s*unit:\s*["'](.+?)["']\s*\},\s*backups:\s*([\d]+),\s*databases:\s*([\d]+),\s*ports:\s*([\d]+)\s*\},\s*billing:\s*["'](.+?)["'],\s*minCredits:\s*([\d]+),\s*description:\s*\{\s*idealFor:\s*["'](.+?)["'],\s*perfectFor:\s*["'](.+?)["']\s*\}(?:,\s*highlight:\s*(true|false))?\s*\}/);
              
              if (planMatch) {
                const [_, name, price, cpuValue, cpuUnit, ramValue, ramUnit, diskValue, diskUnit, backups, databases, ports, billing, minCredits, idealFor, perfectFor, highlight] = planMatch;
                
                await connection.query(
                  'INSERT INTO plans (type, name, price, cpu_value, cpu_unit, ram_value, ram_unit, disk_value, disk_unit, backups, databases, ports, billing, min_credits, ideal_for, perfect_for, highlight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                  ['hosting', name, price, cpuValue, cpuUnit, ramValue, ramUnit, diskValue, diskUnit, backups, databases, ports, billing, minCredits, idealFor, perfectFor, highlight === 'true']
                );
                
                // Move to next matching position in the string
                plansContent = plansContent.substring(plansContent.indexOf(planMatch[0]) + planMatch[0].length);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error importing plans:', error);
      }
    }
    
    // Import existing games if the supported_games table is empty
    const [gamesCount] = await connection.query('SELECT COUNT(*) as count FROM supported_games');
    if (gamesCount[0].count === 0) {
      try {
        const supportedGamesPath = path.join(__dirname, '../src/components/SupportedGames.tsx');
        if (fs.existsSync(supportedGamesPath)) {
          const gamesContent = fs.readFileSync(supportedGamesPath, 'utf8');
          const gameMatches = gamesContent.match(/\{\s*name:\s*["'](.+?)["'],\s*logo:\s*["'](.+?)["'],\s*description:\s*["'](.+?)["']\s*\}/g);
          
          if (gameMatches) {
            for (const match of gameMatches) {
              const gameMatch = match.match(/\{\s*name:\s*["'](.+?)["'],\s*logo:\s*["'](.+?)["'],\s*description:\s*["'](.+?)["']\s*\}/);
              if (gameMatch) {
                const [_, name, logo, description] = gameMatch;
                await connection.query(
                  'INSERT INTO supported_games (name, description, logo_path) VALUES (?, ?, ?)',
                  [name, description, logo]
                );
              }
            }
          }
        }
      } catch (error) {
        console.error('Error importing games:', error);
      }
    }
    
    // Create default pages if the pages table is empty
    const [pagesCount] = await connection.query('SELECT COUNT(*) as count FROM pages');
    if (pagesCount[0].count === 0) {
      await connection.query(`
        INSERT INTO pages (slug, title, content, is_published) VALUES 
        ('metalscale', 'MetalScale - Servidores Dedicados', '{"sections":[{"type":"hero","title":"MetalScale - Servidores Dedicados","subtitle":"Potencia y rendimiento sin compromisos","buttonText":"Ver Planes","buttonUrl":"/metalscale#plans"}]}', true),
        ('zenovps', 'ZenoVPS - Servidores VPS', '{"sections":[{"type":"hero","title":"ZenoVPS - Servidores Virtuales","subtitle":"Flexibilidad y control para tus proyectos","buttonText":"Ver Planes","buttonUrl":"/zenovps#plans"}]}', true)
      `);
    }
    
    connection.release();
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1); // Exit if database connection fails
  }
}

// Email configuration
let mailTransporter = null;

async function setupEmailTransporter() {
  try {
    const [settings] = await pool.query('SELECT * FROM zoho_mail_settings WHERE is_active = true LIMIT 1');
    
    if (settings.length > 0) {
      const { host, port, username, password, from_email, from_name } = settings[0];
      
      mailTransporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user: username,
          pass: password
        }
      });
      
      console.log('Email transporter configured successfully');
    }
  } catch (error) {
    console.error('Error setting up email transporter:', error);
  }
}

// Setup database and email transporter
setupDatabase().then(() => {
  setupEmailTransporter();
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

// Check token validity
app.get('/api/admin/check-auth', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// CtrlPanel Settings
app.get('/api/admin/ctrlpanel-settings', authenticateToken, async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT * FROM ctrlpanel_settings ORDER BY id DESC LIMIT 1');
    
    if (settings.length === 0) {
      return res.json({ apiKey: '', apiUrl: '', isConfigured: false });
    }
    
    const setting = settings[0];
    // Mask the API key for security
    const maskedApiKey = setting.api_key ? `${setting.api_key.substring(0, 4)}${'*'.repeat(setting.api_key.length - 8)}${setting.api_key.substring(setting.api_key.length - 4)}` : '';
    
    res.json({
      id: setting.id,
      apiKey: maskedApiKey,
      apiUrl: setting.api_url,
      isConfigured: !!(setting.api_key && setting.api_url),
      isActive: setting.is_active,
      lastUpdated: setting.last_updated
    });
  } catch (error) {
    console.error('Error fetching CtrlPanel settings:', error);
    res.status(500).json({ error: 'Error fetching CtrlPanel settings' });
  }
});

app.post('/api/admin/ctrlpanel-settings', authenticateToken, async (req, res) => {
  try {
    const { apiKey, apiUrl } = req.body;
    
    if (!apiKey || !apiUrl) {
      return res.status(400).json({ error: 'API Key and API URL are required' });
    }
    
    // Test CtrlPanel API connection before saving
    try {
      const response = await axios.get(`${apiUrl}/v1/servers/count`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (response.status !== 200) {
        return res.status(400).json({ error: 'Invalid CtrlPanel API Key or URL' });
      }
    } catch (error) {
      console.error('Error validating CtrlPanel API:', error);
      return res.status(400).json({ error: 'Invalid CtrlPanel API Key or URL' });
    }
    
    // If validation passed, save the settings
    const [result] = await pool.query(
      'INSERT INTO ctrlpanel_settings (api_key, api_url) VALUES (?, ?) ON DUPLICATE KEY UPDATE api_key = VALUES(api_key), api_url = VALUES(api_url), last_updated = CURRENT_TIMESTAMP',
      [apiKey, apiUrl]
    );
    
    // Update .env file if it exists
    const envPath = path.join(__dirname, '../.env');
    const serverEnvPath = path.join(__dirname, './.env');
    
    try {
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }
      
      // Update or add CTRLPANEL_API_KEY and CTRLPANEL_API_URL
      if (envContent.includes('CTRLPANEL_API_KEY=')) {
        envContent = envContent.replace(/CTRLPANEL_API_KEY=.*\n/, `CTRLPANEL_API_KEY=${apiKey}\n`);
      } else {
        envContent += `\nCTRLPANEL_API_KEY=${apiKey}`;
      }
      
      if (envContent.includes('CTRLPANEL_API_URL=')) {
        envContent = envContent.replace(/CTRLPANEL_API_URL=.*\n/, `CTRLPANEL_API_URL=${apiUrl}\n`);
      } else {
        envContent += `\nCTRLPANEL_API_URL=${apiUrl}`;
      }
      
      fs.writeFileSync(envPath, envContent);
      
      // Also update server .env if it exists
      if (fs.existsSync(serverEnvPath)) {
        let serverEnvContent = fs.readFileSync(serverEnvPath, 'utf8');
        
        if (serverEnvContent.includes('CTRLPANEL_API_KEY=')) {
          serverEnvContent = serverEnvContent.replace(/CTRLPANEL_API_KEY=.*\n/, `CTRLPANEL_API_KEY=${apiKey}\n`);
        } else {
          serverEnvContent += `\nCTRLPANEL_API_KEY=${apiKey}`;
        }
        
        if (serverEnvContent.includes('CTRLPANEL_API_URL=')) {
          serverEnvContent = serverEnvContent.replace(/CTRLPANEL_API_URL=.*\n/, `CTRLPANEL_API_URL=${apiUrl}\n`);
        } else {
          serverEnvContent += `\nCTRLPANEL_API_URL=${apiUrl}`;
        }
        
        fs.writeFileSync(serverEnvPath, serverEnvContent);
      }
    } catch (error) {
      console.error('Error updating .env files:', error);
    }
    
    res.status(201).json({ 
      message: 'CtrlPanel settings saved successfully',
      isConfigured: true
    });
  } catch (error) {
    console.error('Error saving CtrlPanel settings:', error);
    res.status(500).json({ error: 'Error saving CtrlPanel settings' });
  }
});

// Add endpoint to test CtrlPanel connection
app.post('/api/admin/ctrlpanel/test-connection', authenticateToken, async (req, res) => {
  try {
    const { apiKey, apiUrl } = req.body;
    
    if (!apiKey || !apiUrl) {
      return res.status(400).json({ error: 'API Key and API URL are required' });
    }
    
    try {
      // Test connection by making a request to the CtrlPanel API
      const response = await axios.get(`${apiUrl}/v1/servers/count`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (response.status === 200) {
        res.json({ success: true, message: 'Connection successful' });
      } else {
        res.status(400).json({ error: 'Invalid API Key or URL' });
      }
    } catch (error) {
      console.error('Error testing CtrlPanel connection:', error);
      res.status(400).json({ error: 'Invalid API Key or URL' });
    }
  } catch (error) {
    console.error('Error testing CtrlPanel connection:', error);
    res.status(500).json({ error: 'Server error testing connection' });
  }
});

// HetrixTools API Settings endpoints
app.get('/api/admin/hetrixtools-settings', authenticateToken, async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT * FROM hetrixtools_settings ORDER BY id DESC LIMIT 1');
    
    if (settings.length === 0) {
      return res.json({ apiKey: '', isConfigured: false });
    }
    
    const setting = settings[0];
    // Mask the API key for security
    const maskedApiKey = setting.api_key ? `${setting.api_key.substring(0, 4)}${'*'.repeat(setting.api_key.length - 8)}${setting.api_key.substring(setting.api_key.length - 4)}` : '';
    
    res.json({
      id: setting.id,
      apiKey: maskedApiKey,
      isConfigured: !!setting.api_key,
      isActive: setting.is_active,
      lastUpdated: setting.last_updated
    });
  } catch (error) {
    console.error('Error fetching HetrixTools settings:', error);
    res.status(500).json({ error: 'Error fetching HetrixTools settings' });
  }
});

app.post('/api/admin/hetrixtools-settings', authenticateToken, async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API Key is required' });
    }
    
    // Test HetrixTools API connection before saving
    try {
      // Validate the API key by making a test call
      const response = await axios.get('https://api.hetrixtools.com/v1/uptime/monitors/', {
        params: {
          token: apiKey,
        }
      });
      
      if (response.status !== 200) {
        return res.status(400).json({ error: 'Invalid HetrixTools API Key' });
      }
    } catch (error) {
      console.error('Error validating HetrixTools API Key:', error);
      return res.status(400).json({ error: 'Invalid HetrixTools API Key' });
    }
    
    // If validation passed, save the API key
    const [result] = await pool.query(
      'INSERT INTO hetrixtools_settings (api_key) VALUES (?) ON DUPLICATE KEY UPDATE api_key = VALUES(api_key), last_updated = CURRENT_TIMESTAMP',
      [apiKey]
    );
    
    res.status(201).json({ 
      message: 'HetrixTools API Key saved successfully',
      isConfigured: true
    });
  } catch (error) {
    console.error('Error saving HetrixTools API Key:', error);
    res.status(500).json({ error: 'Error saving HetrixTools API Key' });
  }
});

// Add new endpoint to test HetrixTools connection
app.post('/api/admin/hetrixtools/test-connection', authenticateToken, async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API Key is required' });
    }
    
    try {
      // Test connection by making a request to the HetrixTools API
      const response = await axios.get('https://api.hetrixtools.com/v1/uptime/monitors/', {
        params: {
          token: apiKey,
        }
      });
      
      if (response.status === 200) {
        res.json({ success: true, message: 'Connection successful' });
      } else {
        res.status(400).json({ error: 'Invalid API Key or connection failed' });
      }
    } catch (error) {
      console.error('Error testing HetrixTools connection:', error);
      res.status(400).json({ error: 'Invalid API Key or connection failed' });
    }
  } catch (error) {
    console.error('Error testing HetrixTools connection:', error);
    res.status(500).json({ error: 'Server error testing connection' });
  }
});

// Zoho Mail Settings
app.get('/api/admin/zoho-mail-settings', authenticateToken, async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT * FROM zoho_mail_settings ORDER BY id DESC LIMIT 1');
    
    if (settings.length === 0) {
      return res.json({
        host: '',
        port: 587,
        username: '',
        from_email: '',
        from_name: '',
        isConfigured: false
      });
    }
    
    const setting = settings[0];
    // Mask the password for security
    const maskedPassword = setting.password ? '*'.repeat(8) : '';
    
    res.json({
      id: setting.id,
      host: setting.host,
      port: setting.port,
      username: setting.username,
      password: maskedPassword,
      fromEmail: setting.from_email,
      fromName: setting.from_name,
      isConfigured: !!(setting.host && setting.username && setting.password),
      isActive: setting.is_active,
      lastUpdated: setting.last_updated
    });
  } catch (error) {
    console.error('Error fetching Zoho Mail settings:', error);
    res.status(500).json({ error: 'Error fetching Zoho Mail settings' });
  }
});

app.post('/api/admin/zoho-mail-settings', authenticateToken, async (req, res) => {
  try {
    const { host, port, username, password, fromEmail, fromName } = req.body;
    
    if (!host || !port || !username || !password || !fromEmail || !fromName) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Test SMTP connection before saving
    let testTransporter;
    try {
      testTransporter = nodemailer.createTransport({
        host,
        port: parseInt(port),
        secure: parseInt(port) === 465,
        auth: {
          user: username,
          pass: password
        }
      });
      
      await testTransporter.verify();
    } catch (error) {
      console.error('Error validating SMTP connection:', error);
      return res.status(400).json({ error: 'Invalid SMTP settings' });
    }
    
    // If validation passed, save the settings
    const [result] = await pool.query(
      'INSERT INTO zoho_mail_settings (host, port, username, password, from_email, from_name) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE host = VALUES(host), port = VALUES(port), username = VALUES(username), password = VALUES(password), from_email = VALUES(from_email), from_name = VALUES(from_name), last_updated = CURRENT_TIMESTAMP',
      [host, parseInt(port), username, password, fromEmail, fromName]
    );
    
    // Update .env file if it exists
    const envPath = path.join(__dirname, '../.env');
    const serverEnvPath = path.join(__dirname, './.env');
    
    try {
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }
      
      // Update or add Zoho Mail settings
      const envVars = {
        'ZOHO_MAIL_HOST': host,
        'ZOHO_MAIL_PORT': port,
        'ZOHO_MAIL_USERNAME': username,
        'ZOHO_MAIL_PASSWORD': password,
        'ZOHO_MAIL_FROM_EMAIL': fromEmail,
