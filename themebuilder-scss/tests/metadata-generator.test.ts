import { MetadataGenerator } from '../modules/metadata-generator';

const generator = new MetadataGenerator();

describe('Metadata generator - parseComments', () => {
    const commentSamples: Array<string> = [
        '* $name 10. Constant name',
        '* $wrong some wrong comment',
        '* $name 10. Name\n* $type select\n* $typeValues 1|2'
    ];

    test('name parsed correctly', () => {
        expect(generator.parseComments(commentSamples[0])).toEqual({ 'Name': '10. Constant name' });
    });

    test('allowed only variables parsed', () => {
        expect(generator.parseComments(commentSamples[1])).toEqual({});
    });

    test('multiple variables parsed', () => {
        expect(generator.parseComments(commentSamples[2])).toEqual({
            'Name': '10. Name',
            'Type': 'select',
            'TypeValues': '1|2'
        });
    });
});

describe('Metadata generator - getMetaItems (one item)', () => {
    interface Samples {
        [key: string]: string
    }

    const scssSamples: Array<Samples> = [
        {
            'no new line after comment':
`/**
* $name Slide out background
* $type color
*/
$slideout-background: #000;`
        }, {
            '2 new lines after comment':
`/**
* $name Slide out background
* $type color
*/


$slideout-background: #000;`
        }, {
            'extra constant before comment':
`
$base-color: rgb(0,170,0);
/**
* $name Slide out background
* $type color
*/

$slideout-background:  $base-color;`
        }, {
            'spaces after comments':
`/**
* $name Slide out background    
* $type color    
*/
$slideout-background: #000;`
        }];

    scssSamples.forEach((sample) => {
        const key = Object.keys(sample)[0];
        test(key, () => {
            expect(generator.getMetaItems(sample[key])).toEqual([{
                'Name': 'Slide out background',
                'Type': 'color',
                'Key': '$slideout-background'
            }]);
        });
    });
});

describe('Metadata generator - getMetaItems (several item)', () => {
    const sample =
`/**
* $name Slide out background
* $type color
*/
$slideout-background0: #000;

/**
* $name Slide out background
* $type color
*/

$slideout-background1: #000;

$base-color: rgb(0,170,0);
/**
* $name Slide out background
* $type color
*/

$slideout-background2:  $base-color;

/**
* $name Slide out background    
* $type color    
*/
$slideout-background3: #000;`;

    test('parse several items', () => {
        const result = generator.getMetaItems(sample);

        expect(result.length).toBe(4);

        result.forEach((item, index) => {
            expect(item).toEqual({
                'Name': 'Slide out background',
                'Type': 'color',
                'Key': `$slideout-background${index}`
            });
        });
    });
});

describe('Metadata generator - getMetaItems (duplicates removed, only first description used)', () => {
    const sample =
`/**
* $name Slide out background1
* $type color
*/
$slideout-background: #000;

/**
* $name Slide out background2
* $type color
*/

$slideout-background: #000;

$base-color: rgb(0,170,0);
`;

    test('parse items with duplicates', () => {
        const result = generator.getMetaItems(sample);

        expect(result.length).toBe(1);

        expect(result[0]).toEqual({
            'Name': 'Slide out background1',
            'Type': 'color',
            'Key': '$slideout-background'
        });
    });
});

describe('Metadata generator - normalizePath', () => {
    interface TestData {
        cwd: string;
        path: string;
        expected: string;
    }

    const matrix: Array<TestData> = [
        { cwd: '/', path: '/scss/widgets/generic/toolbar/_colors.scss', expected: 'tb/widgets/generic/toolbar/colors' },
        { cwd: '/', path: '/scss/widgets/generic/navBar/_colors.scss', expected: 'tb/widgets/generic/navBar/colors' },
        { cwd: '/repo', path: '/repo/scss/widgets/generic/toolbar/_sizes.scss', expected: 'tb/widgets/generic/toolbar/sizes' },
        { cwd: '/repo/', path: '/repo/scss/widgets/generic/toolbar/_sizes.scss', expected: 'tb/widgets/generic/toolbar/sizes' },
        { cwd: '/repo/../', path: '/scss/widgets/generic/toolbar/_sizes.scss', expected: 'tb/widgets/generic/toolbar/sizes' },
        { cwd: '/repo/../', path: '/repo/../scss/widgets/generic/toolbar/_sizes.scss', expected: 'tb/widgets/generic/toolbar/sizes' },
        { cwd: 'd:\\repo', path: 'd:\\repo\\scss\\widgets\\generic\\toolbar\\_colors.scss', expected: 'tb/widgets/generic/toolbar/colors' },
        { cwd: 'd:\\repo\\', path: 'd:\\repo\\scss\\widgets\\generic\\toolbar\\_colors.scss', expected: 'tb/widgets/generic/toolbar/colors' },
    ];
    test('normalizePath works as expected', () => {
        matrix.forEach((item) => {
            expect(generator.normalizePath(item.cwd, item.path)).toBe(item.expected);
        });
    });
});

describe('Metadata generator - getMapFromMeta', () => {
    const testMetadata: Array<MetaItem> = [
        { 'Key': '$menu-color' },
        { 'Key': '$menu-item-selected-bg' }
    ];
    test('getMapFromMeta works as expected', () => {
        expect(generator.getMapFromMeta(testMetadata, '/'))
            .toBe('(\n"path": "/",\n"$menu-color": $menu-color,\n"$menu-item-selected-bg": $menu-item-selected-bg,\n)');
    });
});

describe('Metadata generator - collectMetadata', () => {
    test('collectMetadata for file without comments return the same content and add nothing to metadata', () => {
        const cwd = '/';
        const path = '/scss/widgets/generic/toolbar/_colors.scss';
        const content = '@use "colors";';

        const result = generator.collectMetadata(cwd, path, content);
        expect(content).toBe(result);
        expect(generator.getMetadata()).toEqual({ 'metadata': [] });
    });

    test('collectMetadata for file with comments modify file content and add data to metadata', () => {
        const cwd = '/';
        const path = '/scss/widgets/generic/toolbar/_colors.scss';
        const content = `
@use "colors";
/**
* $name Slide out background
* $type color
*/
$slideout-background: #000;
`;

        const expected =
`@forward "tb/widgets/generic/toolbar/colors";
@use "tb/widgets/generic/toolbar/colors" as *;

@use "colors";
/**
* $name Slide out background
* $type color
*/
$slideout-background: #000;
$never-used: collector((
"path": "tb/widgets/generic/toolbar/colors",
"$slideout-background": $slideout-background,
));
`;

        const result = generator.collectMetadata(cwd, path, content);
        expect(expected).toBe(result);
        expect(generator.getMetadata()).toEqual({
            'metadata': [{
                'Name': 'Slide out background',
                'Type': 'color',
                'Key': '$slideout-background',
                'Path': 'tb/widgets/generic/toolbar/colors'
            }]
        });
    });

    test('clean method clean metadata', () => {
        // metadata is not empty because of the previous test
        expect(generator.getMetadata()).not.toEqual({ 'metadata': [] });
        generator.clean();
        expect(generator.getMetadata()).toEqual({ 'metadata': [] });
    });

    test('collectMetadata add several item for different files with the same variables names', () => {
        const cwd = '/';
        const path1 = '/scss/widgets/generic/toolbar/_colors.scss';
        const path2 = '/scss/widgets/material/toolbar/_colors.scss';
        const content = `
@use "colors";
/**
* $name Slide out background
* $type color
*/
$slideout-background: #000;
`;

        generator.collectMetadata(cwd, path1, content);
        generator.collectMetadata(cwd, path2, content);

        expect(generator.getMetadata()).toEqual({
            'metadata': [{
                'Name': 'Slide out background',
                'Type': 'color',
                'Key': '$slideout-background',
                'Path': 'tb/widgets/generic/toolbar/colors'
            }, {
                'Name': 'Slide out background',
                'Type': 'color',
                'Key': '$slideout-background',
                'Path': 'tb/widgets/material/toolbar/colors'
            }]
        });
    });
});

