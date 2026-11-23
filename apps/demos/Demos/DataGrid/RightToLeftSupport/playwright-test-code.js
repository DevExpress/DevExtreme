export default async (page) => {
  await page.click('.dx-dropdowneditor-button');
  await page.click('.dx-list-item:first-child');
};
