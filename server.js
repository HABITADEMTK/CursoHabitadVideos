// Entry point wrapper for Hostgator, Hostinger and Node.js hosting platforms expecting server.js
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

import('./dist/server.cjs').catch((err) => {
  console.error('Error starting server from dist/server.cjs:', err);
});
