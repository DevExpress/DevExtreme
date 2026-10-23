export type Theme = [theme: string, size: string, color: string, mode?: string];

const sizes = ['default', 'compact'];
const materialColors = ['blue', 'lime', 'orange', 'purple', 'teal'];
const materialModes = ['light', 'dark'];
const fluentColors = ['blue', 'saas'];
const fluentModes = ['light', 'dark'];
const fluentNextColors = ['blue'];
const fluentNextModes = ['light', 'dark'];
const genericColors = ['carmine', 'contrast', 'dark', 'darkmoon', 'darkviolet', 'greenmist', 'light', 'softblue'];

export const getThemes = (): Theme[] => sizes.flatMap((size): Theme[] => [
  ...materialModes.flatMap((mode) => materialColors.map((color): Theme => ['material', size, color, mode])),
  ...fluentModes.flatMap((mode) => fluentColors.map((color): Theme => ['fluent', size, color, mode])),
  ...fluentNextModes.flatMap((mode) => fluentNextColors.map((color): Theme => ['fluent-next', size, color, mode])),
  ...genericColors.map((color): Theme => ['generic', size, color]),
]);
