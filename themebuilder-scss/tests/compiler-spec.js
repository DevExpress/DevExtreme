const assert = require('chai').assert;
const sass = require('sass');
const Compiler = require('../modules/compiler');

describe('Just compile', () => {
    it('Please!!! compile!!!', () => {

        const config = {
            themeName: 'generic',
            colorScheme: 'light'
        };

        (new Compiler).compile(config);
    });
});

describe('Sass features', () => {
    it('collector function', () => {
        const compiler = new Compiler();
        const map = new sass.types.Map(4);

        // path is always the first
        map.setKey(0, new sass.types.String('path'));
        map.setValue(0, new sass.types.String('tb/path'));
        // number variable
        map.setKey(1, new sass.types.String('$var1'));
        map.setValue(1, new sass.types.Number(300, 'px'));
        // string variable
        map.setKey(2, new sass.types.String('$var2'));
        map.setValue(2, new sass.types.String('Helvetica'));
        // color variable
        map.setKey(3, new sass.types.String('$var3'));
        map.setValue(3, new sass.types.Color(50, 60, 70, 0.4));

        compiler.collector(map);

        assert.deepEqual(compiler.changedVariables, [
            { Key: '$var1', Value: '300px', Path: 'tb/path' },
            { Key: '$var2', Value: 'Helvetica', Path: 'tb/path' },
            { Key: '$var3', Value: 'rgba(50,60,70,0.4)', Path: 'tb/path' },
        ]);
    });

    it('importer', () => {});
});
