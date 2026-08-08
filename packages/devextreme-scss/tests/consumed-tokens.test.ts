import {
  buildAvailableNames,
  collectCustomPropertyReferences,
  collectTokenReferences,
  stripScssComments,
} from '../build/tokens/consumed-tokens';

describe('collectTokenReferences', () => {
  it('collects every distinct ds.$ reference a stylesheet makes', () => {
    const references = collectTokenReferences(
      '$a: ds.$spacing-40;\n$b: ds.$color-content-neutral-default-rest;',
    );

    expect(references).toEqual(['spacing-40', 'color-content-neutral-default-rest']);
  });

  it('ignores references parked in line comments', () => {
    expect(collectTokenReferences('// $a: ds.$spacing-40 !default;')).toEqual([]);
  });

  it('ignores references parked in block comments', () => {
    expect(collectTokenReferences('/* see ds.$spacing-40 */\n$a: ds.$spacing-80;')).toEqual([
      'spacing-80',
    ]);
  });

  it('ignores references spread across a multi-line block comment', () => {
    const content = [
      '/*',
      ' * The divergence marker names ds.$color-surface-primary-default-rest and',
      ' * ds.$color-content-neutral-default-rest as the equivalents.',
      ' */',
      '$a: ds.$spacing-40;',
    ].join('\n');

    expect(collectTokenReferences(content)).toEqual(['spacing-40']);
  });

  it('keeps the declarations between several block comments', () => {
    const content = [
      '/* ds.$dead-before */',
      '$a: ds.$spacing-40;',
      '/*\n * ds.$dead-between\n */',
      '$b: ds.$spacing-80;',
    ].join('\n');

    expect(collectTokenReferences(content)).toEqual(['spacing-40', 'spacing-80']);
  });

  it('ignores a line comment nested inside a block comment', () => {
    const content = '/*\n// $dead: ds.$color-surface-danger-default-rest !default;\n*/\n$a: ds.$spacing-40;';

    expect(collectTokenReferences(content)).toEqual(['spacing-40']);
  });

  it('captures a malformed name whole instead of truncating it to a valid prefix', () => {
    expect(collectTokenReferences('$a: ds.$spacing-40_typo;')).toEqual(['spacing-40_typo']);
    expect(collectTokenReferences('$a: ds.$spacingTypo;')).toEqual(['spacingTypo']);
  });

  it('does not treat a variable that merely ends in ds as a namespace', () => {
    expect(collectTokenReferences('$a: $borders.$spacing-40;')).toEqual([]);
  });
});

describe('collectCustomPropertyReferences', () => {
  it('collects a custom property written without going through the bridge', () => {
    expect(collectCustomPropertyReferences('.x { color: var(--dxds-color-content-neutral-default-rest); }')).toEqual([
      'color-content-neutral-default-rest',
    ]);
  });

  it('collects a reference nested in a relative colour', () => {
    expect(collectCustomPropertyReferences('.x { color: rgb(from var(--dxds-neutral-10) r g b / 40%); }')).toEqual([
      'neutral-10',
    ]);
  });

  it('tolerates whitespace after the opening parenthesis', () => {
    expect(collectCustomPropertyReferences('.x { color: var( --dxds-spacing-40 ); }')).toEqual([
      'spacing-40',
    ]);
  });

  it('ignores custom properties of other namespaces', () => {
    expect(collectCustomPropertyReferences('.x { color: var(--dx-color-text); }')).toEqual([]);
  });

  it('ignores a reference parked in a comment', () => {
    expect(collectCustomPropertyReferences('// color: var(--dxds-spacing-40);')).toEqual([]);
  });
});

describe('stripScssComments', () => {
  it('keeps declarations that follow a closed block comment', () => {
    expect(stripScssComments('/* note */ $a: 1;')).toBe(' $a: 1;');
  });
});

describe('buildAvailableNames', () => {
  const consumed = new Set(['components/core/theme/fluent']);

  it('turns a flat token key into the name the bridge declares', () => {
    const names = buildAvailableNames(
      ['components/core/theme/fluent:button/color/bg/rest'],
      consumed,
    );

    expect([...names]).toEqual(['button-color-bg-rest']);
  });

  it('skips tokens sourced from files the build does not consume', () => {
    const names = buildAvailableNames(
      ['components/wpf/theme/fluent:button/color/bg/rest'],
      consumed,
    );

    expect([...names]).toEqual([]);
  });

  it('keeps a name that another design system also defines, scoped to the consumed file', () => {
    const names = buildAvailableNames(
      [
        'semantic/colors/material/light:color/surface/primary/default/rest',
        'components/core/theme/fluent:color/surface/primary/default/rest',
      ],
      consumed,
    );

    expect([...names]).toEqual(['color-surface-primary-default-rest']);
  });
});
