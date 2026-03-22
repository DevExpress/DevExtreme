import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const menuMetaPath = path.resolve(__dirname, '../../../../apps/demos/menuMeta.json');
const distRoot = path.resolve(__dirname, '../../dist/playground/demos');
const BASE = 'http://localhost:4001';

interface DemoEntry { widget: string; name: string }

function collectDemos(): DemoEntry[] {
    const menuMeta: unknown[] = JSON.parse(fs.readFileSync(menuMetaPath, 'utf-8'));
    const demos: DemoEntry[] = [];
    function traverse(groups: unknown[]): void {
        for (const g of groups as Array<{ Demos?: Array<{ Widget?: string; Name?: string }>; Groups?: unknown[] }>) {
            if (g.Demos) {
                for (const d of g.Demos) {
                    if (d.Widget && d.Name) {
                        const exists = fs.existsSync(path.join(distRoot, d.Widget, d.Name, 'index.html'));
                        if (exists) demos.push({ widget: d.Widget, name: d.Name });
                    }
                }
            }
            if (g.Groups) traverse(g.Groups);
        }
    }
    traverse(menuMeta);
    return demos;
}

const demos = collectDemos();

for (const { widget, name } of demos) {
    test(`${widget}/${name}`, async ({ page }) => {
        const errors: string[] = [];
        page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
        page.on('pageerror', (err) => errors.push(err.message));

        await page.goto(`${BASE}/demos/${widget}/${name}/`);
        await page.waitForTimeout(1000);

        expect(errors, `${errors.join('\n')}`).toHaveLength(0);
    });
}
