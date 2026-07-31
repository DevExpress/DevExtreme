import { ClientFunction } from 'testcafe';

export const changeTheme = async (themeName: string):
Promise<any> => ClientFunction(
  () => new Promise((resolve) => {
    const dxUi = (window as any).DevExpress?.ui;

    if (!dxUi) {
      resolve(undefined);
      return;
    }

    dxUi.themes.ready(resolve);
    dxUi.themes.current(themeName);
  }),
  { dependencies: { themeName } },
)();
