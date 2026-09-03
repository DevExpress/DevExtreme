import * as path from 'path';
import { compileStringAsync } from 'sass-embedded';

const scssRoot = path.resolve(__dirname, '..', 'scss');

const compile = async (source: string): Promise<string> => {
  const result = await compileStringAsync(source, { loadPaths: [scssRoot] });
  return result.css;
};

const ruleFor = (css: string, selector: string): string | null => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  return match ? match[1] : null;
};

const declaration = (rule: string | null, property: string): string | null => {
  const match = rule?.match(new RegExp(`${property}:\\s*([^;}]+)`));
  return match ? match[1].trim() : null;
};

describe('Toolbar disabled state', () => {
  it('should not opt the toolbar out of the disabled dim', async () => {
    const css = await compile('@use "widgets/base/toolbar";');

    expect(css).toContain('.dx-toolbar');
    expect(ruleFor(css, '.dx-toolbar.dx-state-disabled')).toBe(null);
  });
});

describe('Fluent scheduler adjacent-month cell', () => {
  const fluentScheduler = (mode: 'light' | 'dark'): string => `
    @use "widgets/fluent/colors" with ($color: "blue", $mode: "${mode}");
    @use "widgets/fluent/sizes" with ($size: "default");
    @use "widgets/fluent/scheduler";
  `;

  it.each(['light', 'dark'] as const)('should take the hovered cell colour while hovered in the %s palette', async (mode) => {
    const css = await compile(fluentScheduler(mode));

    const hoveredOtherMonth = declaration(
      ruleFor(css, '.dx-scheduler-work-space.dx-scheduler-work-space-month .dx-scheduler-date-table-other-month.dx-state-hover'),
      'color',
    );
    const hoveredCell = declaration(
      ruleFor(css, '.dx-scheduler-date-table-cell.dx-state-hover'),
      'color',
    );
    const otherMonth = declaration(
      ruleFor(css, '.dx-scheduler-date-table-other-month'),
      'color',
    );

    expect(hoveredOtherMonth).not.toBe(null);
    expect(hoveredOtherMonth).toBe(hoveredCell);
    expect(hoveredOtherMonth).not.toBe(otherMonth);
  });
});
