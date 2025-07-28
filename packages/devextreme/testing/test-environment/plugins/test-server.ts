import * as url from 'url';
import type { PluginOption, ViteDevServer, Connect } from 'vite';
import { 
  TemplateRenderer,
  generateFolderListHTML,
  getAllTestsInDirectory,
  type TestFile,
  type TestDirectory 
} from '../template-utils';

const removeRun = (pathname) => pathname.slice(5);

export function testServerPlugin(
  baseDir: string,
  scanTestsInDirectory: (dirPath: string, basePath?: string) => TestDirectory,
  getAllTests: () => TestFile[]
): PluginOption {
  const templateRenderer = new TemplateRenderer(baseDir);

  function generateMainHTML(): string {
    const rootDir = scanTestsInDirectory('');
    const folderListHTML = generateFolderListHTML(rootDir);
    const totalTests = getAllTestsInDirectory(rootDir).length;
    const totalFolders = rootDir.subdirectories.length;
    
    return templateRenderer.renderMainPage(totalTests, totalFolders, folderListHTML);
  }

  function generateTestPageHTML(testFile: TestFile): string {
    return templateRenderer.renderTestPage(testFile);
  }

  const handleMainPage: Connect.HandleFunction = (req, res, next) => {
    const parsedUrl = url.parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';

    if (pathname !== '/') {
      next()
      return;
    }

    res.setHeader('Content-Type', 'text/html');
    res.end(generateMainHTML());
    return;
  };

  const handleTest: Connect.HandleFunction = (req, res, next) => {
    const parsedUrl = url.parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';

    if (pathname.startsWith('/run/')) {
      const testPathFromUrl = removeRun(pathname); 
      const allTests = getAllTests();
      const testFile = allTests.find(t => t.relativePath === testPathFromUrl);
      
      if (testFile) {
        res.setHeader('Content-Type', 'text/html');
        res.end(generateTestPageHTML(testFile));
        return;
      } else {
        console.log('Test not found. Looking for:', testPathFromUrl);
        console.log('Available tests:', allTests.map(t => t.relativePath).slice(0, 5));
        res.writeHead(404);
        res.end('Test not found: ' + testPathFromUrl);
        return;
      }
    }

    next();
  };

  return {
    name: 'test-server',
    
    configureServer(server: ViteDevServer) {
      server.middlewares.use(handleTest);
      server.middlewares.use(handleMainPage);
    },
  };
}