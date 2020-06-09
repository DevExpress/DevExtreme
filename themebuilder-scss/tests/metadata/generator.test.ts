import MetadataGenerator from '../../src/metadata/generator';

const generator = new MetadataGenerator();

describe('Metadata generator - parseComments', () => {
  const commentSamples: Array<string> = [
    '* $name 10. Constant name',
    '* $wrong some wrong comment',
    '* $name 10. Name\n* $type select\n* $typeValues 1|2',
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

  const scssSamples: Array<Samples> = [
    {
      'no new line after comment':
`/**
* $name Slide out background
* $type color
*/
$slideout-background: #000;`,
    }, {
      '2 new lines after comment':
`/**
* $name Slide out background
* $type color
*/


$slideout-background: #000;`,
    }, {
      'extra constant before comment':
`
$base-color: rgb(0,170,0);
/**
* $name Slide out background
* $type color
*/

$slideout-background:  $base-color;`,
    }, {
      'spaces after comments':
`/**
* $name Slide out background
* $type color
*/
$slideout-background: #000;`,
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

describe('Metadata generator - getMetaItems (duplicates removed, only first description used)', () => {
  const sample = `/**
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
    const result = MetadataGenerator.getMetaItems(sample);

    expect(result.length).toBe(1);

    expect(result[0]).toEqual({
      Name: 'Slide out background1',
      Type: 'color',
      Key: '$slideout-background',
    });
  });
});

describe('Metadata generator - normalizePath', () => {
  interface TestData {
    scssPath: string;
    path: string;
    expected: string;
  }

  const isWin = process.platform === 'win32';

  const matrix: Array<TestData> = [
    { scssPath: '/scss', path: '/scss/widgets/generic/toolbar/_colors.scss', expected: 'tb/widgets/generic/toolbar/colors' },
    { scssPath: '/scss', path: '/scss/widgets/generic/navBar/_colors.scss', expected: 'tb/widgets/generic/navBar/colors' },
    { scssPath: '/repo/scss', path: '/repo/scss/widgets/generic/toolbar/_sizes.scss', expected: 'tb/widgets/generic/toolbar/sizes' },
    { scssPath: '/repo/scss', path: '/repo/scss/widgets/generic/toolbar/_sizes.scss', expected: 'tb/widgets/generic/toolbar/sizes' },
    { scssPath: '/repo/../scss', path: '/scss/widgets/generic/toolbar/_sizes.scss', expected: 'tb/widgets/generic/toolbar/sizes' },
    { scssPath: '/repo/../scss', path: '/repo/../scss/widgets/generic/toolbar/_sizes.scss', expected: 'tb/widgets/generic/toolbar/sizes' },
  ];

  if (isWin) {
    const additionalWindowsPaths: Array<TestData> = [
      { scssPath: 'd:\\repo\\scss', path: 'd:\\repo\\scss\\widgets\\generic\\toolbar\\_colors.scss', expected: 'tb/widgets/generic/toolbar/colors' },
      { scssPath: 'd:\\repo\\scss', path: 'd:\\repo\\scss\\widgets\\generic\\toolbar\\_colors.scss', expected: 'tb/widgets/generic/toolbar/colors' },
    ];

    matrix.push(...additionalWindowsPaths);
  }

  test('normalizePath works as expected', () => {
    matrix.forEach((item) => {
      expect(MetadataGenerator.normalizePath(item.scssPath, item.path)).toBe(item.expected);
    });
  });
});

describe('Metadata generator - getMapFromMeta', () => {
  const testMetadata: Array<MetaItem> = [
    { Key: '$menu-color' },
    { Key: '$menu-item-selected-bg' },
  ];

  test('getMapFromMeta works as expected', () => {
    expect(MetadataGenerator.getMapFromMeta(testMetadata, '/'))
      .toBe('(\n"path": "/",\n"$menu-color": $menu-color,\n"$menu-item-selected-bg": $menu-item-selected-bg,\n)');
  });
});

describe('Metadata generator - collectMetadata', () => {
  test('collectMetadata for file without comments return the same content and add nothing to metadata', () => {
    const scssPath = '/scss';
    const path = '/scss/widgets/generic/toolbar/_colors.scss';
    const content = '@use "colors";';

    const result = generator.collectMetadata(scssPath, path, content);
    expect(content).toBe(result);
    expect(generator.getMetadata()).toEqual([]);
  });

  test('collectMetadata for file with comments modify file content and add data to metadata', () => {
    const scssPath = '/scss';
    const path = '/scss/widgets/generic/toolbar/_colors.scss';
    const content = `
@use "colors";
/**
* $name Slide out background
* $type color
*/
$slideout-background: #000;
`;

    const expected = `@forward "tb/widgets/generic/toolbar/colors";
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

    const result = generator.collectMetadata(scssPath, path, content);
    expect(expected).toBe(result);
    expect(generator.getMetadata()).toEqual([{
      Name: 'Slide out background',
      Type: 'color',
      Key: '$slideout-background',
      Path: 'tb/widgets/generic/toolbar/colors',
    }]);
  });

  test('clean method clean metadata', () => {
    // metadata is not empty because of the previous test
    expect(generator.getMetadata()).not.toEqual([]);
    generator.clean();
    expect(generator.getMetadata()).toEqual([]);
  });

  test('collectMetadata add several item for different files with the same variables names', () => {
    const scssPath = '/scss';
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

    generator.collectMetadata(scssPath, path1, content);
    generator.collectMetadata(scssPath, path2, content);

    expect(generator.getMetadata()).toEqual([{
      Name: 'Slide out background',
      Type: 'color',
      Key: '$slideout-background',
      Path: 'tb/widgets/generic/toolbar/colors',
    }, {
      Name: 'Slide out background',
      Type: 'color',
      Key: '$slideout-background',
      Path: 'tb/widgets/material/toolbar/colors',
    }]);
  });
});

describe('Metadata generator - generate bundles content', () => {
  test('isBundleFile', () => {
    expect(MetadataGenerator.isBundleFile('bundles/dx.light.scss')).toBe(true);
    expect(MetadataGenerator.isBundleFile('bundles\\dx.light.scss')).toBe(true);
    expect(MetadataGenerator.isBundleFile('/bundles/dx.light.scss')).toBe(true);
    expect(MetadataGenerator.isBundleFile('path/bundles/dx.light.scss')).toBe(true);
    expect(MetadataGenerator.isBundleFile('path/widgets/generic/accordion/_index.scss')).toBe(false);
    expect(MetadataGenerator.isBundleFile('base/accordion/_index.scss')).toBe(false);
  });

  test('getBundleContent', () => {
    const genericBundleContent = '@use "../widgets/generic" with ( $color: "carmine", $size: "compact");';
    const materialBundleContent = '@use "../widgets/material" with ( $color: "carmine", $size: "compact", $size: "default");';
    const commonBundleContent = '@use "../widgets/common/ui"';

    const expectedGenericBundleContent = '@use "../widgets/generic/tb_index" with ( $color: "carmine", $size: "compact");';
    const expectedMaterialBundleContent = '@use "../widgets/material/tb_index" with ( $color: "carmine", $size: "compact", $size: "default");';

    expect(MetadataGenerator.getBundleContent(genericBundleContent))
      .toBe(expectedGenericBundleContent);

    expect(MetadataGenerator.getBundleContent(materialBundleContent))
      .toBe(expectedMaterialBundleContent);

    expect(MetadataGenerator.getBundleContent(commonBundleContent))
      .toBe(commonBundleContent);
  });
});
