// const assert = require('chai').assert;
const Compiler = require('../modules/compiler');

describe('Just compile', () => {
    it('Please!!! compile!!!', () => {

        const config = {
            sassCompiler: require('dart-sass'),
            themeName: 'generic',
            colorScheme: 'light'
        };

        (new Compiler).compile(config);
    });
});
