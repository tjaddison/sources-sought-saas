const fs = require('fs').promises;
const path = require('path');

// List of API routes that use AWS SDK
const apiRoutes = [
  'app/api/profile/complete-onboarding/route.ts',
  'app/api/indexing/status/route.ts',
  'app/api/indexing/start/route.ts',
  'app/api/indexing/process/route.ts',
  'app/api/indexing/history/route.ts',
  'app/api/documents/[type]/upload/route.ts',
  'app/api/documents/[type]/upload-direct/route.ts',
  'app/api/documents/[type]/route.ts',
  'app/api/documents/[type]/[id]/route.ts',
  'app/api/documents/[type]/[id]/download/route.ts',
  'app/api/waitlist/route.ts',
  'app/api/items/route.ts',
];

const runtimeExport = `\n// Use Node.js runtime for AWS SDK compatibility\nexport const runtime = 'nodejs';\n`;

async function addRuntimeToFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    let content = await fs.readFile(fullPath, 'utf-8');
    
    // Check if runtime is already exported
    if (content.includes("export const runtime = 'nodejs'") || 
        content.includes('export const runtime = "nodejs"')) {
      console.log(`✓ ${filePath} - already has runtime export`);
      return;
    }
    
    // Find the imports section
    const importRegex = /^((?:import[\s\S]*?from\s+['"][^'"]+['"];?\s*\n?)+)/m;
    const match = content.match(importRegex);
    
    if (match) {
      // Add after imports
      const imports = match[1];
      const afterImports = content.slice(match.index + imports.length);
      content = imports + runtimeExport + afterImports;
    } else {
      // Add at the beginning if no imports found
      content = runtimeExport + content;
    }
    
    await fs.writeFile(fullPath, content, 'utf-8');
    console.log(`✅ ${filePath} - added runtime export`);
  } catch (error) {
    console.error(`❌ ${filePath} - error:`, error.message);
  }
}

async function main() {
  console.log('Adding Node.js runtime to API routes that use AWS SDK...\n');
  
  for (const route of apiRoutes) {
    await addRuntimeToFile(route);
  }
  
  console.log('\nDone! All API routes using AWS SDK now have Node.js runtime configured.');
}

main().catch(console.error);