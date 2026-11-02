import * as path from 'path';
import { compileStringAsync } from 'sass-embedded';

const scssRoot = path.resolve(__dirname, '..', 'scss');

interface HoverBg { rgb: string; alpha: string }

const compileHoverBg = async (mode: string, baseHoverBg: string): Promise<HoverBg | null> => {
  const result = await compileStringAsync(`
    @use "sass:color";
    @use "sass:math";
    @use "widgets/material/colors" with ($color: "blue", $mode: "${mode}", $base-hover-bg: ${baseHoverBg});
    @use "widgets/material/gridBase/colors" as grid;

    $hover: grid.$datagrid-hover-bg;

    .probe {
      rgb:
        math.round(color.channel($hover, "red", $space: rgb))
        math.round(color.channel($hover, "green", $space: rgb))
        math.round(color.channel($hover, "blue", $space: rgb));
      alpha: color.alpha($hover);
    }
  `, { loadPaths: [scssRoot] });

  const match = /rgb:\s*([^;]+);\s*alpha:\s*([^;}]+)/.exec(result.css);
  return match ? { rgb: match[1].trim(), alpha: match[2].trim() } : null;
};

describe('Material DataGrid and TreeList row hover background follows $base-hover-bg (T1336741)', () => {
  test.each(['light', 'dark'])('%s mode: a custom $base-hover-bg is applied to hovered rows', async (mode) => {
    expect(await compileHoverBg(mode, '#ffa500')).toEqual({ rgb: '255 165 0', alpha: '1' });
  });

  test.each(['light', 'dark'])('%s mode: a semi-transparent $base-hover-bg still gives an opaque background', async (mode) => {
    expect((await compileHoverBg(mode, 'rgba(255, 0, 0, 0.5)'))?.alpha).toBe('1');
  });
});
