const { spawn, exec } = require('child_process');
const path = require('path');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

console.log('========================================================');
console.log('🚀 DANG KHOI CHAY PETCARE STORE SYSTEM');
console.log('========================================================');

// Start Backend
console.log('\n[1/3] Dang khoi chay Backend Server (Port 5000)...');
const backend = spawn('node', ['src/server.js'], {
  cwd: backendDir,
  shell: true,
  stdio: 'inherit'
});

backend.on('error', (err) => {
  console.error('Loi Backend:', err);
});

// Start Frontend
console.log('[2/3] Dang khoi chay Frontend Web App (Port 3000)...');
const frontend = spawn('npx', ['vite'], {
  cwd: frontendDir,
  shell: true,
  stdio: 'inherit'
});

frontend.on('error', (err) => {
  console.error('Loi Frontend:', err);
});

// Open Browser
setTimeout(() => {
  console.log('[3/3] Dang mo trinh duyet Web: http://localhost:3000');
  exec('start http://localhost:3000');
  exec('start http://localhost:5000/api-docs');
}, 3000);

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
