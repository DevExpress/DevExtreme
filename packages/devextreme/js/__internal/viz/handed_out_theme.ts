import { handedOut, paintingPage } from '@ts/viz/handed_out';
import { getTheme as getRawTheme } from '@ts/viz/themes';

export function getTheme(themeName?: string): unknown {
  return handedOut(getRawTheme(themeName), paintingPage());
}
