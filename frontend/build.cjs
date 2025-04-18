#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// Install specific dependencies that might be causing issues
try {
  console.log('Installing specific dependencies...');
  execSync('npm install react@18.2.0 react-dom@18.2.0 react-router-dom@6.20.1 postcss@8.4.31 --save', { stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Dependency installation failed:', error.message);
  // Continue anyway
}

// Create a temporary entry point for testing
try {
  console.log('Creating temporary entry point...');
  // Rename the main.jsx file to main.original.jsx
  if (fs.existsSync(path.join(process.cwd(), 'src', 'main.jsx'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'main.jsx'),
      path.join(process.cwd(), 'src', 'main.original.jsx')
    );
  }

  // Copy the simplified main.jsx file to main.jsx
  if (fs.existsSync(path.join(process.cwd(), 'src', 'main.simple.jsx'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'main.simple.jsx'),
      path.join(process.cwd(), 'src', 'main.jsx')
    );
  }

  // Rename the index.css file to index.original.css
  if (fs.existsSync(path.join(process.cwd(), 'src', 'index.css'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'index.css'),
      path.join(process.cwd(), 'src', 'index.original.css')
    );
  }

  // Copy the simplified index.css file to index.css
  if (fs.existsSync(path.join(process.cwd(), 'src', 'index.simple.css'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'index.simple.css'),
      path.join(process.cwd(), 'src', 'index.css')
    );
  }

  // Rename the App.css file to App.original.css
  if (fs.existsSync(path.join(process.cwd(), 'src', 'App.css'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'App.css'),
      path.join(process.cwd(), 'src', 'App.original.css')
    );
  }

  // Copy the simplified App.css file to App.css
  if (fs.existsSync(path.join(process.cwd(), 'src', 'App.simple.css'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'App.simple.css'),
      path.join(process.cwd(), 'src', 'App.css')
    );
  }

  console.log('Temporary entry point created successfully!');
} catch (error) {
  console.error('Failed to create temporary entry point:', error.message);
  // Continue anyway
}

// Run the build command
try {
  console.log('Running build command...');
  // Use the CommonJS version of the Vite configuration
  execSync('vite build --config vite.config.cjs', { stdio: 'inherit' });
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

// Restore original files
try {
  console.log('Restoring original files...');

  // Restore the original main.jsx file
  if (fs.existsSync(path.join(process.cwd(), 'src', 'main.original.jsx'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'main.original.jsx'),
      path.join(process.cwd(), 'src', 'main.jsx')
    );
    // Delete the temporary file
    fs.unlinkSync(path.join(process.cwd(), 'src', 'main.original.jsx'));
  }

  // Restore the original index.css file
  if (fs.existsSync(path.join(process.cwd(), 'src', 'index.original.css'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'index.original.css'),
      path.join(process.cwd(), 'src', 'index.css')
    );
    // Delete the temporary file
    fs.unlinkSync(path.join(process.cwd(), 'src', 'index.original.css'));
  }

  // Restore the original App.css file
  if (fs.existsSync(path.join(process.cwd(), 'src', 'App.original.css'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'App.original.css'),
      path.join(process.cwd(), 'src', 'App.css')
    );
    // Delete the temporary file
    fs.unlinkSync(path.join(process.cwd(), 'src', 'App.original.css'));
  }

  console.log('Original files restored successfully!');
} catch (error) {
  console.error('Failed to restore original files:', error.message);
  // Continue anyway
}

console.log('Build script completed!');
