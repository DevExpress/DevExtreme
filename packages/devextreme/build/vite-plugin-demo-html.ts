import fs from 'fs';
import path from 'path';
import type { PluginOption, ViteDevServer } from 'vite';

const demosRoot = path.resolve(__dirname, '../../../apps/demos/Demos');
const demosImagesRoot = path.resolve(__dirname, '../../../apps/demos/images');
const demosDataRoot = path.resolve(__dirname, '../../../apps/demos/data');
const demosSharedRoot = path.resolve(__dirname, '../../../apps/demos/shared');
const mustacheRoot = path.resolve(__dirname, '../../../apps/demos/node_modules/mustache');
const vectormapDataRoot = path.resolve(__dirname, '../artifacts/js/vectormap-data');
const menuMetaPath = path.resolve(__dirname, '../../../apps/demos/menuMeta.json');

type DemoEntry = { title: string; name: string; files: string[] };
type DemosMap = Record<string, DemoEntry[]>;

const DEMO_FILE_EXTENSIONS = ['.html', '.js', '.css', '.json'];

function getDemoFiles(jqueryDir: string): string[] {
    if (!fs.existsSync(jqueryDir)) return [];
    return fs.readdirSync(jqueryDir)
        .filter((f) => DEMO_FILE_EXTENSIONS.includes(path.extname(f)))
        .sort();
}

function buildDemosMap(): DemosMap {
    const result: DemosMap = {};
    const menuMeta: unknown[] = JSON.parse(fs.readFileSync(menuMetaPath, 'utf-8'));

    function traverse(groups: unknown[]): void {
        for (const group of groups as Array<{ Groups?: unknown[]; Demos?: Array<{ Title: string; Name: string; Widget?: string }> }>) {
            if (group.Demos) {
                for (const demo of group.Demos) {
                    if (!demo.Widget || !demo.Name) continue;
                    const jqueryDir = path.join(demosRoot, demo.Widget, demo.Name, 'jQuery');
                    if (!fs.existsSync(path.join(jqueryDir, 'index.html'))) continue;
                    if (!result[demo.Widget]) result[demo.Widget] = [];
                    result[demo.Widget].push({ title: demo.Title, name: demo.Name, files: getDemoFiles(jqueryDir) });
                }
            }
            if (group.Groups) traverse(group.Groups);
        }
    }

    traverse(menuMeta);
    return result;
}

function transformDemoHtml(html: string): string {
    const relativeScripts: string[] = [];

    const scriptRe = /<script\s+src="([^"]+)"\s*><\/script>/gi;
    let m: RegExpExecArray | null;
    while ((m = scriptRe.exec(html)) !== null) {
        if (!m[1].includes('node_modules')) {
            relativeScripts.push(m[1]);
        }
    }

    const loaderScript = `<script type="module">
  import '/demo-init.ts';
  const srcs = ${JSON.stringify(relativeScripts)};
  for (const src of srcs) {
    await new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      document.body.appendChild(s);
    });
  }
</script>`;

    return html
        .replace(/<script[^>]+node_modules[^>]*><\/script>/gi, '')
        .replace(/<link[^>]+devextreme-dist[^>]*>/gi, '')
        .replace(/<script\s+src="(?!http)[^"]*\.js"[^>]*><\/script>/gi, '')
        .replace(/<\/body>/, `${loaderScript}\n</body>`)
        .replace(/<head>/, `<head>\n  <script type="module" src="/@vite/client"></script>`);
}

function transformDemoHtmlForBuild(html: string): string {
    const relativeScripts: string[] = [];

    const scriptRe = /<script\s+src="([^"]+)"\s*><\/script>/gi;
    let m: RegExpExecArray | null;
    while ((m = scriptRe.exec(html)) !== null) {
        const src = m[1];
        if (src.includes('node_modules')) {
            const vmMatch = src.match(/\/vectormap-data\/([^"]+)/);
            if (vmMatch) {
                relativeScripts.push(`../../../vectormap-data/${vmMatch[1]}`);
                continue;
            }
            const mustacheMatch = src.match(/\/mustache\/(mustache(?:\.min)?\.js)/);
            if (mustacheMatch) {
                relativeScripts.push(`../../../mustache/${mustacheMatch[1]}`);
                continue;
            }
        } else {
            relativeScripts.push(src);
        }
    }

    const indexIdx = relativeScripts.indexOf('index.js');
    if (indexIdx !== -1) {
        relativeScripts.splice(indexIdx, 1);
        relativeScripts.push('index.js');
    }

    const loaderScript = `<script type="module">
  import '../../../demo-init.js';
  const srcs = ${JSON.stringify(relativeScripts)};
  for (const src of srcs) {
    await new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      document.body.appendChild(s);
    });
  }
</script>`;

    return html
        .replace(/<script[^>]+node_modules[^>]*><\/script>/gi, '')
        .replace(/<link[^>]+(devextreme-dist|node_modules)[^>]*>/gi, '')
        .replace(/<script\s+src="(?!http)[^"]*\.js"[^>]*><\/script>/gi, '')
        .replace(/<\/body>/, `${loaderScript}\n</body>`);
}

function serveFile(res: import('http').ServerResponse, filePath: string): boolean {
    if (!fs.existsSync(filePath)) return false;
    const ext = path.extname(filePath);
    const contentTypes: Record<string, string> = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
    };
    const content = fs.readFileSync(filePath);
    res.setHeader('Content-Type', contentTypes[ext] ?? 'application/octet-stream');
    res.end(ext === '.html' ? transformDemoHtml(content.toString('utf-8')) : content);
    return true;
}

export default function demoHtmlPlugin(): PluginOption {
    const demosMap = buildDemosMap();
    const VIRTUAL_ID = 'virtual:demos-meta';
    const RESOLVED_ID = `\0${VIRTUAL_ID}`;

    return {
        name: 'devextreme-demo-html',

        resolveId(id: string) {
            if (id === VIRTUAL_ID) return RESOLVED_ID;
            return null;
        },

        load(id: string) {
            if (id === RESOLVED_ID) {
                return `export default ${JSON.stringify({ demosRoot, demos: demosMap })}`;
            }
            return null;
        },

        writeBundle(options: { dir?: string }) {
            const outDir = options.dir ?? 'dist';
            const demosOut = path.join(outDir, 'demos');

            if (fs.existsSync(demosImagesRoot)) {
                fs.cpSync(demosImagesRoot, path.join(outDir, 'images'), { recursive: true });
            }
            if (fs.existsSync(demosDataRoot)) {
                fs.cpSync(demosDataRoot, path.join(outDir, 'data'), { recursive: true });
            }
            if (fs.existsSync(demosSharedRoot)) {
                fs.cpSync(demosSharedRoot, path.join(outDir, 'shared'), { recursive: true });
            }
            if (fs.existsSync(vectormapDataRoot)) {
                fs.cpSync(vectormapDataRoot, path.join(outDir, 'vectormap-data'), { recursive: true });
            }
            if (fs.existsSync(mustacheRoot)) {
                fs.mkdirSync(path.join(outDir, 'mustache'), { recursive: true });
                const mustacheFile = path.join(mustacheRoot, 'mustache.min.js');
                if (fs.existsSync(mustacheFile)) {
                    fs.copyFileSync(mustacheFile, path.join(outDir, 'mustache', 'mustache.min.js'));
                }
            }

            for (const [widget, demos] of Object.entries(demosMap)) {
                for (const { name } of demos) {
                    const jqueryDir = path.join(demosRoot, widget, name, 'jQuery');
                    if (!fs.existsSync(jqueryDir)) continue;

                    const demoOut = path.join(demosOut, widget, name);
                    fs.mkdirSync(demoOut, { recursive: true });

                    for (const file of fs.readdirSync(jqueryDir)) {
                        const src = path.join(jqueryDir, file);
                        const dest = path.join(demoOut, file);
                        if (path.extname(file) === '.html') {
                            fs.writeFileSync(dest, transformDemoHtmlForBuild(fs.readFileSync(src, 'utf-8')));
                        } else {
                            fs.copyFileSync(src, dest);
                        }
                    }
                }
            }
        },

        configureServer(server: ViteDevServer) {
            server.watcher.add(path.join(demosRoot, '**', 'jQuery', '*.{js,css,html}'));

            server.middlewares.use('/images', (req, res, next) => {
                const filePath = path.join(demosImagesRoot, decodeURIComponent(req.url ?? '/'));
                if (serveFile(res, filePath)) return;
                next();
            });

            server.middlewares.use('/demos', (req, res, next) => {
                const urlPath = decodeURIComponent(req.url ?? '/');
                const segments = urlPath.replace(/^\//, '').split('/').filter(Boolean);

                if (segments.length < 2) { next(); return; }

                const [widget, name, ...rest] = segments;
                const jqueryDir = path.join(demosRoot, widget, name, 'jQuery');

                if (rest.length === 0 || urlPath.endsWith('/')) {
                    if (serveFile(res, path.join(jqueryDir, 'index.html'))) return;
                } else {
                    const file = rest.join('/');
                    if (serveFile(res, path.join(jqueryDir, file))) return;
                }

                next();
            });
        },
    };
}
