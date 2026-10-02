import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import devextremeVitePlugin from '../../../packages/devextreme/build/vite-plugin-devextreme.ts';

const repository = fileURLToPath(new URL('../../../', import.meta.url));
const app = path.join(repository, 'apps/react-storybook');
const packageRoot = path.join(repository, 'packages/devextreme');
const require = createRequire(path.join(packageRoot, 'package.json'));
const { build } = await import(require.resolve('vite'));
const beforeCommit = 'a181ecb67ae14900bdb0cc527c1e97a967be6cb3';
process.chdir(packageRoot);
const temporary = await mkdtemp(path.join(tmpdir(), 'resize-review-'));

try {
    try {
        execFileSync('git', ['cat-file', '-e', beforeCommit], { cwd: repository });
    } catch {
        execFileSync('git', ['fetch', '--depth=1', 'origin', beforeCommit], { cwd: repository });
    }

    const archive = path.join(temporary, 'before.tar');
    execFileSync('git', ['archive', '--format=tar', `--output=${archive}`, beforeCommit, 'packages/devextreme/js'], { cwd: repository });
    execFileSync('tar', ['-xf', archive, '-C', temporary]);
    const localization = 'js/__internal/core/localization';
    for (const generated of ['default_messages.ts', 'cldr-data']) {
        await cp(path.join(packageRoot, localization, generated), path.join(temporary, 'packages/devextreme', localization, generated), { recursive: true });
    }
    await symlink(path.join(packageRoot, 'node_modules'), path.join(temporary, 'packages/devextreme/node_modules'));

    for (const version of ['before', 'after']) {
        const source = path.join(version === 'before' ? temporary : repository, 'packages/devextreme/js');
        const entry = path.join(temporary, `${version}.js`);
        const render = path.join(app, 'scripts/resize_review_grid.js');
        await writeFile(entry, `import DataGrid from ${JSON.stringify(path.join(source, 'ui/data_grid.js'))};\nimport renderResizeReview from ${JSON.stringify(render)};\nrenderResizeReview(DataGrid);`);

        const output = path.join(app, 'stories/assets/resize-review', version);
        await mkdir(output, { recursive: true });
        await build({
            configFile: false,
            root: packageRoot,
            plugins: [devextremeVitePlugin()],
            oxc: false,
            define: { 'process.env.NODE_ENV': JSON.stringify('production') },
            resolve: {
                alias: {
                    '@js': source,
                    '@ts': path.join(source, '__internal'),
                },
            },
            build: {
                outDir: output,
                emptyOutDir: true,
                lib: { entry, name: 'ResizeReview', formats: ['iife'], fileName: () => 'grid.js' },
            },
        });
        console.log(`Built ${version} resize review from ${version === 'before' ? beforeCommit : 'current source'}`);
    }
} finally {
    await rm(temporary, { recursive: true, force: true });
}
