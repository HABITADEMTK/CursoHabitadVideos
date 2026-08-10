// Entry point wrapper for Hostinger and Node.js hosting platforms expecting server.js
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}
import './dist/server.cjs';
