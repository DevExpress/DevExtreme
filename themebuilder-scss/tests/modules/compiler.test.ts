import { ImportMock } from 'ts-mock-imports';
import sass from 'sass';
import path from 'path';
import fs from 'fs';
import * as realMetadata from '../../data/metadata/dx-theme-builder-metadata';
import { metadata } from '../data/metadata';

import { Compiler } from '../../modules/compiler';
import noModificationsResult from '../data/compilation-results/no-changes-css';
import noModificationsMeta from '../data/compilation-results/no-changes-meta';

const dataPath: string = path.join(path.resolve(), 'tests', 'data');

describe('compile', () => {
    beforeEach(() => {
        ImportMock.mockOther(realMetadata, 'metadata', metadata);
    });

    afterEach(() => {
        ImportMock.restore();
    });

    const bundle = path.join(dataPath, 'scss', 'bundles', 'dx.light.scss');

    test('Compile with empty modifications (check that items can be undefined)', () => {
        // expect.assertions(2);
        const compiler = new Compiler();
        return compiler.compile(bundle, null, null).then(data => {
            // compiled css
            expect(noModificationsResult).toBe(data.result.css.toString());
            // collected variables
            expect(noModificationsMeta).toEqual(data.changedVariables);
        });
    });

    test('Compile with one base and one accordion items modified', () => {
        const compiler = new Compiler();
        return compiler.compile(bundle, [
            { key: '$base-accent', value: 'red' },
            { key: '$accordion-item-title-opened-bg', value: 'green' },
        ], null).then(data => {
            // compiled css
            expect(data.result.css.toString()).toBe(`.dx-accordion {
  background-color: "Helvetica Neue", "Segoe UI", Helvetica, Verdana, sans-serif;
  color: red;
}
.dx-accordion .from-base {
  background-color: green;
  color: red;
}`);
            // collected variables
            expect(data.changedVariables).toEqual([
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
            ]);
        });
    });

    test('Compile with error', () => {
        const compiler = new Compiler();
        return compiler.compile('dx.error.scss', [], null).then(
            data => expect(false).toBe(true),
            error => {
                expect(error.status).toBe(3);
                expect(error.formatted).toBe('Error: dx.error.scss: no such file or directory');
            }
        );
    });

    test('Compile with custom sass compiler options (try to compile with custom data)', () => {
        const compiler = new Compiler();
        const bundleContent = fs.readFileSync(bundle, 'utf8');
        const extraOptions = {
            data: bundleContent + '.extra-class { color: red; }',
            outputStyle: 'compressed' as const
        };
        return compiler.compile(bundle, [], extraOptions).then(data => {
            // compiled css
            expect(data.result.css.toString()).toBe('.dx-accordion{background-color:"Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif;\
color:#337ab7}.dx-accordion .from-base{background-color:transparent;color:#337ab7}.extra-class{color:red}');
        });
    });
});

describe('Sass features', () => {
    beforeEach(() => {
        ImportMock.mockOther(realMetadata, 'metadata', [
            { 'Key': '$var0', 'Name': '10. Font size', 'Type': 'text', 'Path': 'tb/path' },
            { 'Key': '$var1', 'Name': '10. Font family', 'Type': 'text', 'Path': 'tb/path' },
            { 'Key': '$var2', 'Name': '10. Accent color', 'Type': 'color', 'Path': 'tb/path' },
            { 'Key': '$var3', 'Name': '10. Select color', 'Type': 'color', 'Path': 'tb/another/path' }
        ]);
    });

    afterEach(() => {
        ImportMock.restore();
    });

    test('collector function', () => {
        const compiler = new Compiler();
        const map = new sass.types.Map(7);

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
        const list1 = new sass.types.List(3);
        list1.setValue(0, new sass.types.Number(10, 'px'));
        list1.setValue(1, new sass.types.Number(15, 'px'));
        list1.setValue(2, new sass.types.Number(32, 'px'));
        list1.setSeparator(true);
        map.setValue(4, list1);
        // list variable with ','
        map.setKey(5, new sass.types.String('$var5'));
        const list2 = new sass.types.List(3);
        list2.setValue(0, new sass.types.Number(10, 'px'));
        list2.setValue(1, new sass.types.Number(15, 'px'));
        list2.setValue(2, new sass.types.Number(32, 'px'));
        list2.setSeparator(false);
        map.setValue(5, list2);
        // null variable
        map.setKey(6, new sass.types.String('$var6'));
        map.setValue(6, sass.types.Null.NULL);

        compiler.collector(map);

        expect(compiler.changedVariables).toEqual([
            { Key: '$var1', Value: '300px', Path: 'tb/path' },
            { Key: '$var2', Value: 'Helvetica', Path: 'tb/path' },
            { Key: '$var3', Value: 'rgba(50,60,70,0.4)', Path: 'tb/path' },
            { Key: '$var4', Value: '10px,15px,32px', Path: 'tb/path' },
            { Key: '$var5', Value: '10px 15px 32px', Path: 'tb/path' },
        ]);
    });

    test('getMatchingUserItemsAsString - return right string for the url', () => {
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

            expect(content).toEqual(testCase.expected);
        });
    });

    test('setter function (custom importer)', () => {
        const compiler = new Compiler();
        compiler.userItems = [{
            key: '$var2',
            value: 'rgba(0,0,0,0)'
        }, {
            key: '$var0',
            value: '10px'
        }];

        const setterResult = compiler.setter('tb/path', '');
        expect(setterResult).toEqual({ contents: '$var2: rgba(0,0,0,0);$var0: 10px;' });
        expect(compiler.importerCache).toEqual({ 'tb/path': '$var2: rgba(0,0,0,0);$var0: 10px;' });
    });

    test('setter call getMatchingUserItemsAsString once for every url', () => {
        const url = 'path1';
        const compiler = new Compiler();
        compiler.getMatchingUserItemsAsString = jest.fn().mockImplementation(() => 'content');;
        compiler.setter(url, '');
        compiler.setter(url, '');
        compiler.setter(url, '');

        expect(compiler.getMatchingUserItemsAsString).toHaveBeenCalledTimes(1);
        expect(compiler.importerCache[url]).toBe('content');
    });
});
