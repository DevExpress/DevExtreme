const assert = require('chai').assert;
const mock = require('mock-require');
const sass = require('sass');
const path = require('path');

const Compiler = require('../modules/compiler');

describe('compileBundle', () => {
    beforeEach(() => {
        mock('../data/metadata/dx-theme-builder-metadata', {
            'metadata': [
                { 'Key': '$base-font-family', 'Name': '', 'Type': 'text', 'Path': 'tb/widgets/generic/colors' },
                { 'Key': '$base-accent', 'Name': '', 'Type': 'color', 'Path': 'tb/widgets/generic/colors' },
                { 'Key': '$accordion-title-color', 'Name': '', 'Type': 'color', 'Path': 'tb/widgets/generic/accordion/colors' },
                { 'Key': '$accordion-item-title-opened-bg', 'Name': '', 'Type': 'color', 'Path': 'tb/widgets/generic/accordion/colors' }
            ]
        });
    });

    afterEach(() => {
        mock.stopAll();
    });

    const bundle = path.join(path.resolve(), 'tests', 'test-scss', 'bundles', 'dx.light.scss');

    // TODO - test that cache is working (function called once)

    it('Compile with empty modifications', () => {
        const compiler = new Compiler();
        return compiler.compileBundle(bundle, []).then(data => {
            // compiled css
            assert.equal(`.dx-accordion {
  background-color: "Helvetica Neue", "Segoe UI", Helvetica, Verdana, sans-serif;
  color: #337ab7;
}
.dx-accordion .from-base {
  background-color: transparent;
  color: #337ab7;
}`,
            data.result.css.toString());
            // collected variables
            assert.deepEqual([
                {
                    Key: '$base-font-family',
                    Value: '"Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif',
                    Path: 'tb/widgets/generic/colors'
                },
                {
                    Key: '$base-accent',
                    Value: 'rgba(51,122,183,1)',
                    Path: 'tb/widgets/generic/colors'
                },
                {
                    Key: '$accordion-title-color',
                    Value: 'rgba(51,122,183,1)',
                    Path: 'tb/widgets/generic/accordion/colors'
                },
                {
                    Key: '$accordion-item-title-opened-bg',
                    Value: 'rgba(0,0,0,0)',
                    Path: 'tb/widgets/generic/accordion/colors'
                }
            ], data.changedVariables);
        });
    });

    it('Compile with one base and one accordion items modified', () => {
        const compiler = new Compiler();
        return compiler.compileBundle(bundle, [
            { key: '$base-accent', value: 'red' },
            { key: '$accordion-item-title-opened-bg', value: 'green' },
        ]).then(data => {
            // compiled css
            assert.equal(`.dx-accordion {
  background-color: "Helvetica Neue", "Segoe UI", Helvetica, Verdana, sans-serif;
  color: red;
}
.dx-accordion .from-base {
  background-color: green;
  color: red;
}`,
            data.result.css.toString());
            // collected variables
            assert.deepEqual([
                {
                    Key: '$base-font-family',
                    Value: '"Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif',
                    Path: 'tb/widgets/generic/colors'
                },
                {
                    Key: '$base-accent',
                    Value: 'rgba(255,0,0,1)', // red
                    Path: 'tb/widgets/generic/colors'
                },
                {
                    Key: '$accordion-title-color',
                    Value: 'rgba(255,0,0,1)', // red
                    Path: 'tb/widgets/generic/accordion/colors'
                },
                {
                    Key: '$accordion-item-title-opened-bg',
                    Value: 'rgba(0,128,0,1)', // green
                    Path: 'tb/widgets/generic/accordion/colors'
                }
            ], data.changedVariables);
        });
    });

    it('Compile with error', () => {
        const compiler = new Compiler();
        return compiler.compileBundle('dx.error.scss', []).then(
            data => assert.notOk(true, 'Error bundle was resolved'),
            error => {
                assert.equal(3, error.status);
                assert.equal('Error: dx.error.scss: no such file or directory', error.formatted);
            }
        );
    });
});

describe('Sass features', () => {
    beforeEach(() => {
        mock('../data/metadata/dx-theme-builder-metadata', {
            'metadata': [
                { 'Key': '$var0', 'Name': '10. Font size', 'Type': 'text', 'Path': 'tb/path' },
                { 'Key': '$var1', 'Name': '10. Font family', 'Type': 'text', 'Path': 'tb/path' },
                { 'Key': '$var2', 'Name': '10. Accent color', 'Type': 'color', 'Path': 'tb/path' },
                { 'Key': '$var3', 'Name': '10. Select color', 'Type': 'color', 'Path': 'tb/another/path' }
            ]
        });
    });

    afterEach(() => {
        mock.stopAll();
    });

    it('collector function', () => {
        const compiler = new Compiler();
        const map = new sass.types.Map(5);

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
        // list variable
        map.setKey(4, new sass.types.String('$var4'));
        const list = new sass.types.List(3);
        list.setValue(0, new sass.types.Number(10, 'px'));
        list.setValue(1, new sass.types.Number(15, 'px'));
        list.setValue(2, new sass.types.Number(32, 'px'));
        list.setSeparator(true);
        map.setValue(4, list);


        compiler.collector(map);

        assert.deepEqual(compiler.changedVariables, [
            { Key: '$var1', Value: '300px', Path: 'tb/path' },
            { Key: '$var2', Value: 'Helvetica', Path: 'tb/path' },
            { Key: '$var3', Value: 'rgba(50,60,70,0.4)', Path: 'tb/path' },
            { Key: '$var4', Value: '10px,15px,32px', Path: 'tb/path' },
        ]);
    });

    it('getMatchingUserItemsAsString - return right string for the url', () => {
        const compiler = new Compiler();

        const testCases = [
            {
                'userItems': [{
                    key: '$var2',
                    value: 'rgba(0,0,0,0)'
                }, {
                    key: '$var0',
                    value: '10px'
                }],
                'url': 'tb/path',
                'expected': '$var2: rgba(0,0,0,0);$var0: 10px;'
            },
            {
                'userItems': [{
                    key: '$var2',
                    value: 'rgba(0,0,0,0)'
                }],
                'url': 'tb/path',
                'expected': '$var2: rgba(0,0,0,0);'
            },
            {
                'userItems': [{
                    key: '$var3',
                    value: 'rgba(0,0,0,0)'
                }],
                'url': 'tb/path',
                'expected': ''
            },
            {
                'userItems': [{
                    key: '$var3',
                    value: 'rgba(0,0,0,0)'
                }],
                'url': 'tb/another/path',
                'expected': '$var3: rgba(0,0,0,0);'
            }
        ];

        testCases.forEach(testCase => {
            compiler.userItems = testCase.userItems;

            const content = compiler.getMatchingUserItemsAsString(testCase.url);

            assert.equal(content, testCase.expected);
        });
    });

    it('setter function (custom importer)', (done) => {
        const compiler = new Compiler();
        compiler.userItems = [{
            key: '$var2',
            value: 'rgba(0,0,0,0)'
        }, {
            key: '$var0',
            value: '10px'
        }];

        compiler.setter('tb/path', '', data => {
            assert.deepEqual(data, { contents: '$var2: rgba(0,0,0,0);$var0: 10px;' });
            assert.deepEqual(compiler.importerCache, { 'tb/path': '$var2: rgba(0,0,0,0);$var0: 10px;' });
            done();
        });
    });
});
