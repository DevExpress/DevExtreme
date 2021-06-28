const width = 1200;
const height = 800;

export const restoreBrowserSize = async (t: TestController):
Promise<any> => t.resizeWindow(width, height);
