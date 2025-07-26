import { Plugin } from 'vite';
import { spawn } from 'child_process';
import path from 'path';

export function editorPlugin(baseDir: string): Plugin {
  return {
    name: 'editor-integration',
    configureServer(server) {
      server.middlewares.use('/__open-in-editor', (req, res, next) => {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        const file = url.searchParams.get('file');
        
        if (!file) {
          res.statusCode = 400;
          res.end('Missing file parameter');
          return;
        }

        const fullPath = path.resolve(baseDir, file);
        
        // Try to open in VSCode
        openInEditor(fullPath)
          .then(() => {
            res.statusCode = 200;
            res.end('OK');
          })
          .catch((error) => {
            console.error('Failed to open file in editor:', error);
            res.statusCode = 500;
            res.end('Failed to open file in editor');
          });
      });
    }
  };
}

async function openInEditor(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Try 'code' command first (VSCode)
    const child = spawn('code', [filePath], { stdio: 'ignore' });
    
    child.on('error', (error) => {
      if (error.message.includes('ENOENT')) {
        // VSCode not found, try other editors
        tryAlternativeEditors(filePath)
          .then(resolve)
          .catch(reject);
      } else {
        reject(error);
      }
    });
    
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Editor exited with code ${code}`));
      }
    });
  });
}

async function tryAlternativeEditors(filePath: string): Promise<void> {
  const editors = [
    { command: 'cursor', args: [filePath] },
    { command: 'subl', args: [filePath] },
    { command: 'atom', args: [filePath] },
    { command: 'vim', args: [filePath] },
    { command: 'nano', args: [filePath] }
  ];

  for (const editor of editors) {
    try {
      await new Promise<void>((resolve, reject) => {
        const child = spawn(editor.command, editor.args, { stdio: 'ignore' });
        child.on('error', reject);
        child.on('exit', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`${editor.command} exited with code ${code}`));
        });
      });
      return; // Success
    } catch (error) {
      // Try next editor
      continue;
    }
  }
  
  throw new Error('No suitable editor found');
}