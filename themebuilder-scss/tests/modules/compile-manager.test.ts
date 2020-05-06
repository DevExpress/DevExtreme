import path from 'path';
import { ImportMock } from 'ts-mock-imports';
import { CompileManager } from '../../src/modules/compile-manager';

import * as realMetadata from '../../src/data/metadata/dx-theme-builder-metadata';
import * as bundleResolver from '../../src/modules/bundle-resolver';
import { metadata } from '../data/metadata';

import noModificationsResult from '../data/compilation-results/no-changes-css';
import noModificationsMeta from '../data/compilation-results/no-changes-meta';

const dataPath = path.join(path.resolve(), 'tests', 'data');

describe('Compile manager - integration test on test sass', () => {
    beforeEach(() => {
        ImportMock.mockOther(realMetadata, 'metadata', metadata);
        ImportMock.mockOther(bundleResolver, 'resolveBundle', () => path.join(dataPath, 'scss', 'bundles', 'dx.light.scss'));
    });

    afterEach(() => {
        ImportMock.restore();
    });

    test('compile test bundle without swatch', () => {
        const manager = new CompileManager();
        return manager.compile({}).then(result => {
            expect(result.css).toBe(noModificationsResult);
            expect(result.compiledMetadata).toEqual(noModificationsMeta);
        });
    });

    test('compile test bundle without swatch', () => {
        const manager = new CompileManager();
        return manager.compile({
            makeSwatch: true,
            outColorScheme: 'test-theme'
        }).then(result => {
            expect(result.css).toBe(`.dx-swatch-test-theme .dx-accordion {
  background-color: "Helvetica Neue", "Segoe UI", Helvetica, Verdana, sans-serif;
  color: #337ab7;
}
.dx-swatch-test-theme .dx-accordion .from-base {
  background-color: transparent;
  color: #337ab7;
}`);
            expect(result.compiledMetadata).toEqual(noModificationsMeta);
        });
    });

    test('compile test bundle with error', () => {
        const manager = new CompileManager();
        expect(manager.compile({
            makeSwatch: true,
            outColorScheme: 'error for sass compiler :)'
        })).rejects.toBeTruthy();
    });
});
