const assert = require('chai').assert;
const PreCompiler = require('../modules/pre-compiler');


describe('PreCompiler class tests', () => {
    it('createSassForSwatch', () => {
        const preCompiler = new PreCompiler();
        assert.equal(preCompiler.createSassForSwatch('test-theme-name', 'sass'), '.dx-swatch-test-theme-name { sass };');
    });
});
