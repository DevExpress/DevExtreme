const assert = require('chai').assert;
const mock = require('mock-require');
const path = require('path');
let CompileManager = require('../modules/compile-manager');

const dataPath = path.join(path.resolve(), 'tests', 'data');
const noModificationsResult = require('./data/compilation-results/without-modifications-css');


describe('Compile manager - integration test on test sass', () => {
    beforeEach(() => {
        mock('../data/metadata/dx-theme-builder-metadata', require('./data/metadata'));
        mock('../modules/bundle-resolver', () => {
            return path.join(dataPath, 'scss', 'bundles', 'dx.light.scss');
        });
        CompileManager = mock.reRequire('../modules/compile-manager');
    });

    afterEach(() => {
        mock.stopAll();
    });

    it('compile test bundle without swatch', () => {
        const manager = new CompileManager();
        return manager.compile({}).then(result => {
            assert.equal(noModificationsResult, result.css);
            assert.deepEqual(require('./data/compilation-results/without-modifications-meta'), result.compiledMetadata);
        });
    });

    it('compile test bundle without swatch', () => {
        const manager = new CompileManager();
        return manager.compile({
            makeSwatch: true,
            outColorScheme: 'test-theme'
        }).then(result => {
            assert.equal(`.dx-swatch-test-theme .dx-accordion {
  background-color: "Helvetica Neue", "Segoe UI", Helvetica, Verdana, sans-serif;
  color: #337ab7;
}
.dx-swatch-test-theme .dx-accordion .from-base {
  background-color: transparent;
  color: #337ab7;
}`, result.css);
            assert.deepEqual(require('./data/compilation-results/without-modifications-meta'), result.compiledMetadata);
        });
    });
});
