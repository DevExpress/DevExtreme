const assert = require('chai').assert;
const mock = require('mock-require');
// const lessCompiler = require('less/lib/less-node');
const generator = require('../modules/metadata-generator');

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
$slideout-background: #000;

/**
* $name Slide out background
* $type color
*/

$slideout-background: #000;

$base-color: rgb(0,170,0);
/**
* $name Slide out background
* $type color
*/

$slideout-background:  $base-color;

/**
* $name Slide out background    
* $type color    
*/
$slideout-background: #000;`;

    it('parse several items', () => {
        const result = generator.getMetaItems(sample);

        assert.equal(result.length, 4);

        result.forEach((item) => {
            assert.deepEqual(item, {
                'Name': 'Slide out background',
                'Type': 'color',
                'Key': '$slideout-background'
            });
        });
    });
});

