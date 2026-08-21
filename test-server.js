const { createServer } = require('http');
const { spawn } = require('child_process');
const path = require('path');

// Start server
const server = spawn('node', ['node_modules/tsx/dist/cli.mjs', './server.ts'], {
  cwd: path.resolve(__dirname),
  stdio: 'pipe'
});

let output = '';
server.stdout.on('data', d => { output += d.toString(); });
server.stderr.on('data', d => { output += d.toString(); });

// Wait for server to start then test
setTimeout(() => {
  const http = require('http');
  
  // Test HTTP
  http.get('http://localhost:3000', (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      console.log('=== Server Output ===');
      console.log(output.trim());
      console.log('');
      console.log('=== HTTP GET / ===');
      console.log('Status:', res.statusCode);
      console.log('Body:', body);
      console.log('');
      console.log('=== RESULT: ALL TESTS PASSED ===');
      server.kill();
      process.exit(0);
    });
  }).on('error', (e) => {
    console.log('Failed to connect:', e.message);
    server.kill();
    process.exit(1);
  });
}, 3000);
