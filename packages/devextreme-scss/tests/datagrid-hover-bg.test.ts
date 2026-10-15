import * as path from 'path';
import { compileStringAsync } from 'sass-embedded';

const scssRoot = path.resolve(__dirname, '..', 'scss');

const extractChannels = (css: string): string | null => {
  const match = /\.probe\s*\{\s*channels:\s*([^;}]+)/.exec(css);
  return match ? match[1].trim() : null;
};

const compileHoverChannels = async (mode: string, baseHoverBg?: string): Promise<string | null> => {
  const override = baseHoverBg ? `, $base-hover-bg: ${baseHoverBg}` : '';
  const result = await compileStringAsync(`
    @use "sass:color";
    @use "sass:math";
    @use "widgets/material/colors" with ($color: "blue", $mode: "${mode}"${override});
    @use "widgets/material/gridBase/colors" as grid;

    $hover: grid.$datagrid-hover-bg;

    .probe {
      channels:
        math.round(color.channel($hover, "red", $space: rgb))
        math.round(color.channel($hover, "green", $space: rgb))
        math.round(color.channel($hover, "blue", $space: rgb))
        color.alpha($hover);
    }
  `, { loadPaths: [scssRoot] });

  return extractChannels(result.css);
};

describe('Material DataGrid and TreeList row hover background follows $base-hover-bg (T1336741)', () => {
  test.each([
    ['light', '245 245 245 1'],
    ['dark', '50 50 50 1'],
  ])('%s mode: the default $base-hover-bg is blended onto the grid background', async (mode, expected) => {
    expect(await compileHoverChannels(mode)).toBe(expected);
  });

  test.each(['light', 'dark'])('%s mode: an opaque $base-hover-bg is used as is', async (mode) => {
    expect(await compileHoverChannels(mode, '#ffa500')).toBe('255 165 0 1');
  });

  test.each([
    ['light', '255 128 128 1'],
    ['dark', '148 21 21 1'],
  ])('%s mode: a semi-transparent $base-hover-bg results in an opaque background', async (mode, expected) => {
    expect(await compileHoverChannels(mode, 'rgba(255, 0, 0, 0.5)')).toBe(expected);
  });
});
