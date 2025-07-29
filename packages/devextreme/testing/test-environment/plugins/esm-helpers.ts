import type { PluginOption, ViteDevServer } from 'vite';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Transform DevExtreme module imports to absolute paths
 */
function transformInternalImports(code: string, baseDir: string, fileName?: string): string {
  let transformedCode = code;
  
  // Transform core module imports (core/utils/ajax -> /js/core/utils/ajax.js)
  const devExtremeModules = ['core', 'common', 'data', 'ui', 'viz', 'localization', 'integration'];
  
  devExtremeModules.forEach(moduleName => {
    const regex = new RegExp(`import\\s+(.+)\\s+from\\s+['"]${moduleName}/([^'"]+)['"]`, 'g');
    transformedCode = transformedCode.replace(regex, (match, imports, modulePath) => {
      const fullPath = path.join(baseDir, 'js', moduleName, modulePath);
      const jsPath = fullPath + '.js';
      const tsPath = fullPath + '.ts';
      
      // Check if .js or .ts file exists
      if (fs.existsSync(jsPath)) {
        if (fileName) console.log(`🔧 [ESM Helpers] Transforming ${moduleName} import in ${fileName}: ${modulePath} -> .js`);
        return `import ${imports} from '/js/${moduleName}/${modulePath}.js'`;
      } else if (fs.existsSync(tsPath)) {
        if (fileName) console.log(`🔧 [ESM Helpers] Transforming ${moduleName} import in ${fileName}: ${modulePath} -> .ts`);
        return `import ${imports} from '/js/${moduleName}/${modulePath}.ts'`;
      } else {
        if (fileName) console.log(`🔧 [ESM Helpers] Transforming ${moduleName} import in ${fileName}: ${modulePath} (no extension check)`);
        return `import ${imports} from '/js/${moduleName}/${modulePath}'`;
      }
    });
  });
  
  // Transform import statements
  transformedCode = transformedCode.replace(
    /import\s+(.+)\s+from\s+['"]__internal\/([^'"]+)['"]/g,
    (match, imports, internalPath) => {
      const tsPath = path.join(baseDir, 'js/__internal', internalPath + '.ts');
      const jsPath = path.join(baseDir, 'js/__internal', internalPath + '.js');
      
      if (fs.existsSync(tsPath)) {
        if (fileName) console.log(`🔧 [ESM Helpers] Transforming __internal import in ${fileName}: ${internalPath} -> .ts`);
        return `import ${imports} from '/js/__internal/${internalPath}.ts'`;
      } else if (fs.existsSync(jsPath)) {
        if (fileName) console.log(`🔧 [ESM Helpers] Transforming __internal import in ${fileName}: ${internalPath} -> .js`);
        return `import ${imports} from '/js/__internal/${internalPath}.js'`;
      } else {
        if (fileName) console.log(`🔧 [ESM Helpers] Transforming __internal import in ${fileName}: ${internalPath} (no extension check)`);
        return `import ${imports} from '/js/__internal/${internalPath}'`;
      }
    }
  );
  
  // Transform require statements
  transformedCode = transformedCode.replace(
    /require\s*\(\s*['"]__internal\/([^'"]+)['"]\s*\)/g,
    (match, internalPath) => {
      const tsPath = path.join(baseDir, 'js/__internal', internalPath + '.ts');
      const jsPath = path.join(baseDir, 'js/__internal', internalPath + '.js');
      
      if (fs.existsSync(tsPath)) {
        if (fileName) console.log(`🔧 [ESM Helpers] Transforming __internal require in ${fileName}: ${internalPath} -> .ts`);
        return `require('/js/__internal/${internalPath}.ts')`;
      } else if (fs.existsSync(jsPath)) {
        if (fileName) console.log(`🔧 [ESM Helpers] Transforming __internal require in ${fileName}: ${internalPath} -> .js`);
        return `require('/js/__internal/${internalPath}.js')`;
      } else {
        if (fileName) console.log(`🔧 [ESM Helpers] Transforming __internal require in ${fileName}: ${internalPath} (no extension check)`);
        return `require('/js/__internal/${internalPath}')`;
      }
    }
  );
  
  return transformedCode;
}

/**
 * Vite plugin for automatically replacing UMD helpers with ESM versions
 */
export function esmHelpersPlugin(baseDir: string): PluginOption {
  const helpersDir = path.join(baseDir, 'testing/helpers');
  const esmHelpersDir = path.join(helpersDir, 'esm');
  
  // List of UMD modules that need to be replaced with ESM
  const umdHelpers = new Set([
    'ajaxMock.js',
    'data.errorHandlingHelper.js',
    'executeAsyncMock.js',
    'keyboardMock.js',
    'memoryLeaksHelper.js',
    'nativePointerMock.js',
    'includeThemesLinks.js',
    'pointerMock.js',
    'positionFixtures.js',
    'publicModulesHelper.js',
    'qunitPerformanceExtension.js',
    'responsiveBoxScreenMock.js',
    'vizMocks.js'
  ]);

  return {
    name: 'esm-helpers',
    
    configureServer(server: ViteDevServer) {
      // Middleware for handling requests to testing/helpers
      server.middlewares.use('/testing/helpers', (req, res, next) => {
        const url = req.url || '';
        const fileName = path.basename(url);
        
        // Check if the requested file is a UMD module
        if (umdHelpers.has(fileName)) {
          const esmFilePath = path.join(esmHelpersDir, fileName);
          
          // Check existence of ESM version
          if (fs.existsSync(esmFilePath)) {
            console.log(`🔄 [ESM Helpers] Serving ESM version: ${fileName}`);
            
            let esmContent = fs.readFileSync(esmFilePath, 'utf-8');
            const originalContent = esmContent;
            
            // Transform DevExtreme module imports and __internal imports using the shared function
            esmContent = transformInternalImports(esmContent, baseDir, fileName);
            
            if (esmContent !== originalContent) {
              console.log(`🔧 [ESM Helpers] Content transformed in middleware for ${fileName}`);
            }
            
            res.setHeader('Content-Type', 'application/javascript');
            res.setHeader('Cache-Control', 'no-cache');
            res.end(esmContent);
            return;
          } else {
            console.warn(`⚠️  [ESM Helpers] ESM version not found for ${fileName}`);
            console.warn(`   Expected: ${esmFilePath}`);
            console.warn(`   Run: node testing/helpers/umd-to-esm-converter.js`);
          }
        }
        
        next();
      });

      // Add virtual route for checking ESM modules status
      server.middlewares.use('/__esm-helpers-status', (req, res) => {
        const status = {
          esmDir: esmHelpersDir,
          umdHelpers: Array.from(umdHelpers),
          esmFiles: [] as string[],
          missing: [] as string[]
        };

        umdHelpers.forEach(fileName => {
          const esmPath = path.join(esmHelpersDir, fileName);
          if (fs.existsSync(esmPath)) {
            status.esmFiles.push(fileName);
          } else {
            status.missing.push(fileName);
          }
        });

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(status, null, 2));
      });
    },

    // Transform HTML files to replace imports
    transformIndexHtml: {
      enforce: 'pre',
      transform(html: string, context) {
        if (context.path?.includes('/test/')) {
          // Replace UMD module imports with ESM versions in script type="module"
          const transformedHtml = html.replace(
            /import\s+['"]\/testing\/helpers\/([^'"]+\.js)['"]/g,
            (match, fileName) => {
              if (umdHelpers.has(fileName)) {
                console.log(`🔄 [ESM Helpers] Transforming import: ${fileName}`);
                return `import '/testing/helpers/esm/${fileName}'`;
              }
              return match;
            }
          );
          
          return transformedHtml;
        }
        return html;
      }
    },

    // Transform JS/TS files to replace imports
    transform(code: string, id: string) {
      // Process test files, helper files, and any files with DevExtreme module imports
      if (id.includes('/testing/tests/') || id.includes('/testing/helpers/esm/') || 
          code.includes('__internal/') || 
          /from\s+['"](?:core|common|data|ui|viz|localization|integration)\//.test(code)) {
        let transformedCode = code;
        
        // Replace absolute imports /testing/helpers/
        transformedCode = transformedCode.replace(
          /import\s+(.+)\s+from\s+['"]\/testing\/helpers\/([^'"]+\.js)['"]/g,
          (match, imports, fileName) => {
            if (umdHelpers.has(fileName)) {
              console.log(`🔄 [ESM Helpers] Transforming absolute import in ${path.basename(id)}: ${fileName}`);
              return `import ${imports} from '/testing/helpers/esm/${fileName}'`;
            }
            return match;
          }
        );
        
        // Replace relative imports ../../helpers/
        transformedCode = transformedCode.replace(
          /import\s+(.+)\s+from\s+['"]\.\.\/\.\.\/helpers\/([^'"]+\.js)['"]/g,
          (match, imports, fileName) => {
            if (umdHelpers.has(fileName)) {
              console.log(`🔄 [ESM Helpers] Transforming relative import in ${path.basename(id)}: ${fileName}`);
              return `import ${imports} from '/testing/helpers/esm/${fileName}'`;
            }
            return match;
          }
        );
        
        // Transform DevExtreme module imports and __internal imports using the shared function
        transformedCode = transformInternalImports(transformedCode, baseDir, path.basename(id));
        
        if (transformedCode !== code) {
          console.log(`🔧 [ESM Helpers] Code transformed for ${path.basename(id)}`);
          return {
            code: transformedCode,
            map: null
          };
        }
      }
      
      return null;
    }
  };
}

/**
 * Utility for generating ESM versions of all UMD helpers
 */
export async function generateESMHelpers(baseDir: string): Promise<void> {
  const converterPath = path.join(baseDir, 'testing/helpers/umd-to-esm-converter.js');
  
  try {
    // Dynamically import and run converter
    const UMDToESMConverter = require(converterPath);
    const converter = new UMDToESMConverter(path.join(baseDir, 'testing/helpers'));
    
    console.log('🚀 Generating ESM versions of UMD helpers...');
    converter.convertAllHelpers();
  } catch (error) {
    console.error('❌ Failed to generate ESM helpers:', error);
    throw error;
  }
}