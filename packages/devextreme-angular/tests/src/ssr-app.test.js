import { componentNames } from '../src/server/component-names.ts'
const baseUrl = 'http://localhost:4200/';

const dxComponentNames = componentNames.filter((name) => {
  return !['diagram', 'scheduler'].includes(name);
});

fixture('SSR app markup');

test('should render widget markup on the server', async (t) => {
  const response = await t.request({
    url: baseUrl,
    method: 'GET',
  });

  await t.expect(response.status).eql(200);

  const html = response.body || '';

  for (const componentName of dxComponentNames) {
    await t.expect(html).contains(`<dx-${componentName}`);
  }
});

test('should render and hydrate widgets in DOM', async (t) => {
  await t.navigateTo(baseUrl, { waitForPageLoad: false });

  const bodyHtml = await t.eval(() => document.body?.innerHTML || '');

  for (const componentName of dxComponentNames) {
    await t.expect(bodyHtml).contains(`<dx-${componentName}`);
  }
  
  const { log, info, warn, error } = await t.getBrowserConsoleMessages();
  
  await t.expect(log.join('')).contains(`Angular hydrated 1 component(s) and ${dxComponentNames.length + 1} node(s), ${dxComponentNames.length} component(s)`);
});
