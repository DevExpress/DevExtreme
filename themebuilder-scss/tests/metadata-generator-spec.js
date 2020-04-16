const assert = require('chai').assert;
const MetadataGenerator = require('../modules/metadata-generator');
const generator = new MetadataGenerator();

describe('Metadata generator - parseComments', () => {
    const commentSamples = [
        '* $name 10. Constant name',
        '* $wrong some wrong comment',
        '* $name 10. Name\n* $type select\n* $typeValues 1|2'
    ];

    it('name parsed correctly', () => {
        assert.deepEqual(generator.parseComments(commentSamples[0]), { 'Name': '10. Constant name' });
    });

    it('allowed only variables parsed', () => {
        assert.deepEqual(generator.parseComments(commentSamples[1]), {});
    });

    it('multiple variables parsed', () => {
        assert.deepEqual(generator.parseComments(commentSamples[2]), {
            'Name': '10. Name',
            'Type': 'select',
            'TypeValues': '1|2'
        });
    });
});

describe('Metadata generator - getMetaItems (one item)', () => {
    const scssSamples = [
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
        it(key, () => {
            assert.deepEqual(generator.getMetaItems(sample[key]), [{
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

    it('parse several items', () => {
        const result = generator.getMetaItems(sample);

        assert.equal(result.length, 4);

        result.forEach((item, index) => {
            assert.deepEqual(item, {
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

    it('parse items with duplicates', () => {
        const result = generator.getMetaItems(sample);

        assert.equal(result.length, 1);

        assert.deepEqual(result[0], {
            'Name': 'Slide out background1',
            'Type': 'color',
            'Key': '$slideout-background'
        });
    });
});

describe('Metadata generator - normalizePath', () => {
    const matrix = [
        { cwd: '/', path: '/scss/widgets/generic/toolbar/_colors.scss', expected: 'tb/widgets/generic/toolbar/colors' },
        { cwd: '/', path: '/scss/widgets/generic/navBar/_colors.scss', expected: 'tb/widgets/generic/navBar/colors' },
        { cwd: '/repo', path: '/repo/scss/widgets/generic/toolbar/_sizes.scss', expected: 'tb/widgets/generic/toolbar/sizes' },
        { cwd: '/repo/', path: '/repo/scss/widgets/generic/toolbar/_sizes.scss', expected: 'tb/widgets/generic/toolbar/sizes' },
        { cwd: '/repo/../', path: '/scss/widgets/generic/toolbar/_sizes.scss', expected: 'tb/widgets/generic/toolbar/sizes' },
        { cwd: '/repo/../', path: '/repo/../scss/widgets/generic/toolbar/_sizes.scss', expected: 'tb/widgets/generic/toolbar/sizes' },
        { cwd: 'd:\\repo', path: 'd:\\repo\\scss\\widgets\\generic\\toolbar\\_colors.scss', expected: 'tb/widgets/generic/toolbar/colors' },
        { cwd: 'd:\\repo\\', path: 'd:\\repo\\scss\\widgets\\generic\\toolbar\\_colors.scss', expected: 'tb/widgets/generic/toolbar/colors' },
    ];
    it('normalizePath works as expected', () => {
        matrix.forEach((item) => {
            assert.equal(generator.normalizePath(item.cwd, item.path), item.expected);
        });
    });
});

describe('Metadata generator - getMapFromMeta', () => {
    const testMetadata = [
        { 'Key': '$menu-color' },
        { 'Key': '$menu-item-selected-bg' }
    ];
    it('getMapFromMeta works as expected', () => {
        assert.equal(generator.getMapFromMeta(testMetadata, '/'),
            '(\n"path": "/",\n"$menu-color": $menu-color,\n"$menu-item-selected-bg": $menu-item-selected-bg,\n)');
    });
});

describe('Metadata generator - collectMetadata', () => {
    it('collectMetadata for file without comments return the same content and add nothing to metadata', () => {
        const cwd = '/';
        const path = '/scss/widgets/generic/toolbar/_colors.scss';
        const content = '@use "colors";';

        const result = generator.collectMetadata(cwd, path, content);
        assert.equal(content, result);
        assert.deepEqual(generator.getMetadata(), { 'metadata': [] });
    });

    it('collectMetadata for file with comments modify file content and add data to metadata', () => {
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
@debug collector((
"path": "tb/widgets/generic/toolbar/colors",
"$slideout-background": $slideout-background,
));
`;

        const result = generator.collectMetadata(cwd, path, content);
        assert.equal(expected, result);
        assert.deepEqual(generator.getMetadata(), {
            'metadata': [{
                'Name': 'Slide out background',
                'Type': 'color',
                'Key': '$slideout-background',
                'Path': 'tb/widgets/generic/toolbar/colors'
            }]
        });
    });

    it('clean method clean metadata', () => {
        // metadata is not empty because of the previous test
        assert.notDeepEqual(generator.getMetadata(), { 'metadata': [] });
        generator.clean();
        assert.deepEqual(generator.getMetadata(), { 'metadata': [] });
    });

    it('collectMetadata add several item for different files with the same variables names', () => {
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

        assert.deepEqual(generator.getMetadata(), {
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

