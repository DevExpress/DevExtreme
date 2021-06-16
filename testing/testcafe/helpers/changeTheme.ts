import { ClientFunction } from 'testcafe';

export const changeTheme = async (themeName: string):
Promise<any> => ClientFunction(async () => new Promise((resolve) => {
  (window as any).DevExpress.ui.themes.ready(resolve);
  (window as any).DevExpress.ui.themes.current(themeName);
}),
{ dependencies: { themeName } })();
