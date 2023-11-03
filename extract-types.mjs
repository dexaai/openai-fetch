import fs from 'fs';
import path from 'path';

/**
 * This is used to extract the type declarations from the openai Node.js
 * package. Doing this allows it to be a devDependency instead of a dependency,
 * which greatly reduces the size of the final bundle.
 */
function extractTypes(srcDir, destDir, root = false) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      extractTypes(srcPath, destPath);
    } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
      console.log(destPath);

      if (root && entry.name === 'index.d.ts') {
        // OpenAI has one line with an absolute package import, so switch it to
        // be a relative import.
        const content = fs
          .readFileSync(srcPath, 'utf8')
          .replaceAll("'openai/resources/index'", "'./resources/index.js'");
        fs.writeFileSync(destPath, content);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

extractTypes('node_modules/openai', 'openai-types', true);
