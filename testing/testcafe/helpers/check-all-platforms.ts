import { IComparerOptions } from 'devextreme-screenshot-comparer/build/src/options';
import { resolve } from 'path';
import url from './getPageUrl';

const platformsSiteRootPath = resolve('./testing/renovation/platforms');

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const cloneTest = (page, platforms: ('react' | 'angular' | 'vue')[] = ['react', 'angular', 'vue']) => (
  testName: string, testBody: (
    t: TestController,
    { platform, screenshotComparerOptions }:
    { platform: string; screenshotComparerOptions: Partial<IComparerOptions> }) => Promise<any>,
): void => {
  platforms.forEach((platform) => {
    const pageUrl = url(`${platformsSiteRootPath}/${platform}/dist`, `${page}.html`);
    test.page(pageUrl)(
      `${platform}: ${testName}`,
      (t) => testBody(t, {
        platform,
        screenshotComparerOptions: { screenshotsRelativePath: `/screenshots/${platform}` },
      }),
    );
  });
};

export default cloneTest;
