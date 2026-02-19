import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('nexaprofit.db');

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    balance REAL DEFAULT 0,
    is_admin INTEGER DEFAULT 0,
    last_profit_calc INTEGER,
    referred_by TEXT,
    referral_earnings REAL DEFAULT 0
  );
  // ... (Other tables: deposits, withdrawals, investments)
`);

const app = express();
app.use(express.json());

// API Routes (Auth, Deposits, Withdrawals, Admin)
// ... (Implementation of /api/auth/google, /api/deposit, etc.)

async function startServer() {
  const PORT = process.env.PORT || 3000;
  
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));
  } else {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

startServer();