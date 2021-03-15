import { ClientFunction } from 'testcafe';

export default async function (themeName: string): Promise<any> {
  return ClientFunction(() => new Promise((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(themeName);
  }),
  { dependencies: { themeName } })();
}
