import MetadataGenerator from '../../src/metadata/generator';

const generator = new MetadataGenerator();

type Theme = 'material' | 'generic' | 'fluent';

describe('Metadata generator - parseComments', () => {
  const commentSamples: string[] = [
    '* $name 10. Constant name',
    '* $wrong some wrong comment',
    '* $name 10. Name\n* $type select\n* $type-values 1|2',
  ];

  test('name parsed correctly', () => {
    expect(MetadataGenerator.parseComments(commentSamples[0])).toEqual({ Name: '10. Constant name' });
  });

  test('allowed only variables parsed', () => {
    expect(MetadataGenerator.parseComments(commentSamples[1])).toEqual({});
  });

  test('multiple variables parsed', () => {
    expect(MetadataGenerator.parseComments(commentSamples[2])).toEqual({
      Name: '10. Name',
      Type: 'select',
      TypeValues: '1|2',
    });
  });
});

describe('Metadata generator - getMetaItems (one item)', () => {
  interface Samples {
    [key: string]: string;
  }

  const scssSamples: Samples[] = [
    {
      'no new line after comment':
`/**
* $name Slide out background
* $type color
*/
$slideout-background: #000 !default;`,
    }, {
      '2 new lines after comment':
`/**
* $name Slide out background
* $type color
*/


$slideout-background: #000 !default;`,
    }, {
      'extra constant before comment':
`
$base-color: rgb(0,170,0);
/**
* $name Slide out background
* $type color
*/

$slideout-background:  $base-color !default;`,
    }, {
      'spaces after comments':
`/**
* $name Slide out background
* $type color
*/
$slideout-background: #000 !default;`,
    }];

  scssSamples.forEach((sample) => {
    const key = Object.keys(sample)[0];

    test(key, () => {
      expect(MetadataGenerator.getMetaItems(sample[key])).toEqual([{
        Name: 'Slide out background',
        Type: 'color',
        Key: '$slideout-background',
      }]);
    });
  });
});

describe('Metadata generator - getMetaItems (several item)', () => {
  const sample = `/**
* $name Slide out background
* $type color
*/
$slideout-background0: #000 !default;

/**
* $name Slide out background
* $type color
*/

$slideout-background1: #000 !default;

$base-color: rgb(0,170,0);
/**
* $name Slide out background
* $type color
*/

$slideout-background2:  $base-color !default;

/**
* $name Slide out background
* $type color
*/
$slideout-background3: #000 !default;`;

  test('parse several items', () => {
    const result = MetadataGenerator.getMetaItems(sample);

    expect(result.length).toBe(4);

    result.forEach((item, index) => {
      expect(item).toEqual({
        Name: 'Slide out background',
        Type: 'color',
        Key: `$slideout-background${index}`,
      });
    });
  });
});

describe('Metadata generator - getMetaItems (duplicate comment throw an error)', () => {
  const sample = `/**
* $name Slide out background1
* $type color
*/
$slideout-background: #000 !default;

/**
* $name Slide out background2
* $type color
*/

$slideout-background: #000 !default;

$base-color: rgb(0,170,0);
`;

  test('parse items with duplicates', () => {
    expect(() => MetadataGenerator.getMetaItems(sample)).toThrowError('$slideout-background has duplicated comment');
  });
});

describe('Metadata generator - getMetaItems (variable without !default flag throw an error - T944915)', () => {
  const sample = `/**
* $name Slide out background1
* $type color
*/
$slideout-background: #000;
`;

  test('parse items with duplicates', () => {
    expect(() => MetadataGenerator.getMetaItems(sample)).toThrowError('$slideout-background value has no \'!default\' flag');
  });
});

describe('Metadata generator - getMapFromMeta', () => {
  const testMetadata: MetaItem[] = [
    { Key: '$menu-color' },
    { Key: '$menu-item-selected-bg' },
  ];

  test('getMapFromMeta works as expected', () => {
    expect(MetadataGenerator.getMapFromMeta(testMetadata))
      .toBe('(\n"$menu-color": $menu-color,\n"$menu-item-selected-bg": $menu-item-selected-bg,\n)');
  });
});

describe('Metadata generator - collectMetadata', () => {
  test('collectMetadata for file without comments add nothing to metadata and save file content', () => {
    const path = '/scss/widgets/generic/toolbar/_colors.scss';
    const content = '@use "colors";';

    const result = generator.collectMetadata(path, content);
    expect(content).toBe(result);
    expect(generator.getMetadata()).toEqual({ generic: [], material: [], fluent: [] });
  });

  test('collectMetadata for file with comments modify file content and add data to metadata', () => {
    const path = '/scss/widgets/generic/toolbar/_colors.scss';
    const content = `@use "colors";
/**
* $name Slide out background
* $type color
*/
$slideout-background: #000 !default;
`;

    const expected = `$slideout-background: getCustomVar(("$slideout-background")) !default;

@use "colors";
/**
* $name Slide out background
* $type color
*/
$slideout-background: #000 !default;
$never-used: collector((
"$slideout-background": $slideout-background,
));
`;

    const result = generator.collectMetadata(path, content);
    expect(result).toBe(expected);
    expect(generator.getMetadata()).toEqual({
      generic: [
        {
          Name: 'Slide out background',
          Type: 'color',
          Key: '$slideout-background',
        },
      ],
      material: [],
      fluent: [],
    });
  });

  test('clean method clean metadata', () => {
    // metadata is not empty because of the previous test
    expect(generator.getMetadata()).not.toEqual([]);
    generator.clean();
    expect(generator.getMetadata()).toEqual({ generic: [], material: [], fluent: [] });
  });

  test('collectMetadata add several item for different files with the same variables names', () => {
    const content = `
@use "colors";
/**
* $name Slide out background
* $type color
*/
$slideout-background: #000 !default;
`;

    [
      '/scss/widgets/generic/toolbar/_colors.scss',
      '/scss/widgets/material/toolbar/_colors.scss',
      '/scss/widgets/fluent/toolbar/_colors.scss',
      'other.scss',
    ].forEach((path) => generator.collectMetadata(path, content));

    expect(generator.getMetadata()).toEqual({
      generic: [{
        Name: 'Slide out background',
        Type: 'color',
        Key: '$slideout-background',
      }],
      material: [{
        Name: 'Slide out background',
        Type: 'color',
        Key: '$slideout-background',
      }],
      fluent: [{
        Name: 'Slide out background',
        Type: 'color',
        Key: '$slideout-background',
      }],
    });
  });

  test('collectMetadata - right content for bundle', () => {
    const path = '/scss/bundles/dx.light.scss';
    const content = `
@use "../widgets/generic";
`;

    const expected = `
@use "../widgets/generic/tb_index";
`;
    const result = generator.collectMetadata(path, content);

    expect(result).toBe(expected);
  });
});

describe('Metadata generator - generate files content', () => {
  test('isBundleFile', () => {
    expect(MetadataGenerator.isBundleFile('bundles/dx.light.scss')).toBe(true);
    expect(MetadataGenerator.isBundleFile('bundles\\dx.light.scss')).toBe(true);
    expect(MetadataGenerator.isBundleFile('/bundles/dx.light.scss')).toBe(true);
    expect(MetadataGenerator.isBundleFile('path/bundles/dx.light.scss')).toBe(true);
    expect(MetadataGenerator.isBundleFile('path/widgets/generic/accordion/_index.scss')).toBe(false);
    expect(MetadataGenerator.isBundleFile('base/accordion/_index.scss')).toBe(false);
  });

  test('getBundleContent', () => {
    const bundleContent = (theme: Theme) => `
    @use "../widgets/${theme}/colors" with ($color: "carmine");
    @use "../widgets/${theme}/sizes" with ($size: "compact");
    @use "../widgets/${theme}/typography";
    @use "../widgets/${theme}";`;

    const expectedBundleContent = (theme: Theme) => `
    @use "../widgets/${theme}/colors" with ($color: "carmine");
    @use "../widgets/${theme}/sizes" with ($size: "compact");
    @use "../widgets/${theme}/typography";
    @use "../widgets/${theme}/tb_index";`;

    const commonBundleContent = '@use "../widgets/common/ui"';

    ['material', 'generic', 'fluent'].forEach((theme: Theme) => expect(MetadataGenerator.getBundleContent(bundleContent(theme)))
        .toBe(expectedBundleContent(theme)));

    expect(MetadataGenerator.getBundleContent(commonBundleContent))
      .toBe(commonBundleContent);
  });
});
