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
  execSync('npm install react@18.2.0 react-dom@18.2.0 react-router-dom@6.20.1 react-hot-toast@2.4.1 postcss@8.4.31 recharts@2.10.3 --save --force', { stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Dependency installation failed:', error.message);
  // Continue anyway
}

// Use deployment versions of files for production build
try {
  console.log('Preparing for production build...');

  // Create a backup of the index.css file if it contains Tailwind imports
  if (fs.existsSync(path.join(process.cwd(), 'src', 'index.css'))) {
    const indexCssContent = fs.readFileSync(path.join(process.cwd(), 'src', 'index.css'), 'utf8');

    // Check if the file contains Tailwind imports
    if (indexCssContent.includes('@import "tailwindcss"')) {
      console.log('Detected Tailwind imports in index.css, creating a modified version...');

      // Create a modified version without Tailwind imports
      const modifiedContent = indexCssContent.replace(/@import\s+"tailwindcss".*;?/g, '');

      // Backup the original file
      fs.copyFileSync(
        path.join(process.cwd(), 'src', 'index.css'),
        path.join(process.cwd(), 'src', 'index.original.css')
      );

      // Write the modified content
      fs.writeFileSync(path.join(process.cwd(), 'src', 'index.css'), modifiedContent);

      console.log('Modified index.css created successfully!');
    }
  }

  // Backup and replace App.jsx with the deployment version
  if (fs.existsSync(path.join(process.cwd(), 'src', 'App.jsx'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'App.jsx'),
      path.join(process.cwd(), 'src', 'App.original.jsx')
    );

    if (fs.existsSync(path.join(process.cwd(), 'src', 'App.deploy.jsx'))) {
      fs.copyFileSync(
        path.join(process.cwd(), 'src', 'App.deploy.jsx'),
        path.join(process.cwd(), 'src', 'App.jsx')
      );
      console.log('Deployment version of App.jsx copied successfully!');
    }
  }

  // Backup and replace App.css with the deployment version
  if (fs.existsSync(path.join(process.cwd(), 'src', 'App.css'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'App.css'),
      path.join(process.cwd(), 'src', 'App.original.css')
    );

    if (fs.existsSync(path.join(process.cwd(), 'src', 'App.deploy.css'))) {
      fs.copyFileSync(
        path.join(process.cwd(), 'src', 'App.deploy.css'),
        path.join(process.cwd(), 'src', 'App.css')
      );
      console.log('Deployment version of App.css copied successfully!');
    }
  }

  // Backup and replace main.jsx with the deployment version
  if (fs.existsSync(path.join(process.cwd(), 'src', 'main.jsx'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'main.jsx'),
      path.join(process.cwd(), 'src', 'main.original.jsx')
    );

    if (fs.existsSync(path.join(process.cwd(), 'src', 'main.deploy.jsx'))) {
      fs.copyFileSync(
        path.join(process.cwd(), 'src', 'main.deploy.jsx'),
        path.join(process.cwd(), 'src', 'main.jsx')
      );
      console.log('Deployment version of main.jsx copied successfully!');
    }
  }

  console.log('Production build preparation completed!');
} catch (error) {
  console.error('Failed to prepare for production build:', error.message);
  // Continue anyway
}

// Copy the custom index.html file to the root directory
try {
  console.log('Copying custom index.html...');
  if (fs.existsSync(path.join(process.cwd(), 'custom-index.html'))) {
    // Backup the original index.html file
    if (fs.existsSync(path.join(process.cwd(), 'index.html'))) {
      fs.copyFileSync(
        path.join(process.cwd(), 'index.html'),
        path.join(process.cwd(), 'index.original.html')
      );
    }

    // Copy the custom index.html file to index.html
    fs.copyFileSync(
      path.join(process.cwd(), 'custom-index.html'),
      path.join(process.cwd(), 'index.html')
    );

    console.log('Custom index.html copied successfully!');
  }
} catch (error) {
  console.error('Failed to copy custom index.html:', error.message);
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

  // Restore the original index.css file if it was modified
  if (fs.existsSync(path.join(process.cwd(), 'src', 'index.original.css'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'index.original.css'),
      path.join(process.cwd(), 'src', 'index.css')
    );
    // Delete the temporary file
    fs.unlinkSync(path.join(process.cwd(), 'src', 'index.original.css'));
    console.log('Original index.css restored successfully!');
  }

  // Restore the original App.jsx file if it was modified
  if (fs.existsSync(path.join(process.cwd(), 'src', 'App.original.jsx'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'App.original.jsx'),
      path.join(process.cwd(), 'src', 'App.jsx')
    );
    // Delete the temporary file
    fs.unlinkSync(path.join(process.cwd(), 'src', 'App.original.jsx'));
    console.log('Original App.jsx restored successfully!');
  }

  // Restore the original App.css file if it was modified
  if (fs.existsSync(path.join(process.cwd(), 'src', 'App.original.css'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'App.original.css'),
      path.join(process.cwd(), 'src', 'App.css')
    );
    // Delete the temporary file
    fs.unlinkSync(path.join(process.cwd(), 'src', 'App.original.css'));
    console.log('Original App.css restored successfully!');
  }

  // Restore the original main.jsx file if it was modified
  if (fs.existsSync(path.join(process.cwd(), 'src', 'main.original.jsx'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'src', 'main.original.jsx'),
      path.join(process.cwd(), 'src', 'main.jsx')
    );
    // Delete the temporary file
    fs.unlinkSync(path.join(process.cwd(), 'src', 'main.original.jsx'));
    console.log('Original main.jsx restored successfully!');
  }

  // Restore the original index.html file if it was modified
  if (fs.existsSync(path.join(process.cwd(), 'index.original.html'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'index.original.html'),
      path.join(process.cwd(), 'index.html')
    );
    // Delete the temporary file
    fs.unlinkSync(path.join(process.cwd(), 'index.original.html'));
    console.log('Original index.html restored successfully!');
  }

  console.log('File restoration completed!');
} catch (error) {
  console.error('Failed to restore original files:', error.message);
  // Continue anyway
}

console.log('Build script completed!');
