import fs from 'fs';
import path from 'path';
import type { PluginOption, ViteDevServer } from 'vite';

const demosRoot = path.resolve(__dirname, '../../../apps/demos/Demos');
const menuMetaPath = path.resolve(__dirname, '../../../apps/demos/menuMeta.json');

type DemoEntry = { title: string; name: string };
type DemosMap = Record<string, DemoEntry[]>;

function buildDemosMap(): DemosMap {
    const result: DemosMap = {};
    const menuMeta: unknown[] = JSON.parse(fs.readFileSync(menuMetaPath, 'utf-8'));

    function traverse(groups: unknown[]): void {
        for (const group of groups as Array<{ Groups?: unknown[]; Demos?: Array<{ Title: string; Name: string; Widget?: string }> }>) {
            if (group.Demos) {
                for (const demo of group.Demos) {
                    if (!demo.Widget || !demo.Name) continue;
                    const jqueryPath = path.join(demosRoot, demo.Widget, demo.Name, 'jQuery', 'index.html');
                    if (!fs.existsSync(jqueryPath)) continue;
                    if (!result[demo.Widget]) result[demo.Widget] = [];
                    result[demo.Widget].push({ title: demo.Title, name: demo.Name });
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
        '.svg': 'image/svg+xml',
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
                return `export default ${JSON.stringify(demosMap)}`;
            }
            return null;
        },

        configureServer(server: ViteDevServer) {
            server.watcher.add(path.join(demosRoot, '**', 'jQuery', '*.{js,css,html}'));

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
