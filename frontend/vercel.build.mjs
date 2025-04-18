#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log the current directory
console.log('Current directory:', process.cwd());

// Log the Node.js version
console.log('Node.js version:', process.version);

// Log the npm version
try {
  const npmVersion = execSync('npm --version').toString().trim();
  console.log('npm version:', npmVersion);
} catch (error) {
  console.error('Error getting npm version:', error.message);
}

// Log the package.json content
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  console.log('package.json dependencies:', Object.keys(packageJson.dependencies));
  console.log('package.json devDependencies:', Object.keys(packageJson.devDependencies));
  console.log('package.json type:', packageJson.type);
} catch (error) {
  console.error('Error reading package.json:', error.message);
}

// Run the build command
try {
  console.log('Running build command...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}

// Check if the dist directory exists
try {
  const distExists = fs.existsSync(path.join(process.cwd(), 'dist'));
  console.log('dist directory exists:', distExists);
  
  if (distExists) {
    // List files in the dist directory
    const distFiles = fs.readdirSync(path.join(process.cwd(), 'dist'));
    console.log('Files in dist directory:', distFiles);
  }
} catch (error) {
  console.error('Error checking dist directory:', error.message);
}

console.log('Build script completed!');
