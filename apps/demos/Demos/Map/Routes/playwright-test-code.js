export default async (page) => {
  await page.waitForSelector('.azure-maps-control-button.curr-style > img', { state: 'attached' });
};
