// eslint-disable-next-line max-classes-per-file
import { IComparerOptions } from 'devextreme-screenshot-comparer/build/src/options';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { pathToFileURL } from 'url';
import type { PlatformType } from './platform-type';

const platformsSiteRootPath = resolve('./testing/renovation/platforms');
export class MultiPlatformTest {
  beforeFn!: (t: TestController, { platform }) => Promise<any>;

  afterFn!: (t: TestController, { platform }) => Promise<any>;

  before(fn: (t: TestController, { platform }) => Promise<any>): this {
    this.beforeFn = fn;
    return this;
  }

  after(fn: (t: TestController, { platform }) => Promise<any>): this {
    this.afterFn = fn;
    return this;
  }
}

function getPageFilePath(platform: PlatformType, page: string): string {
  if (platform === 'jquery') {
    const jqueryPageName = page.lastIndexOf('/') === -1 ? page : page.slice(0, page.lastIndexOf('/') + 1);
    if (existsSync(`${platformsSiteRootPath}/jquery/${jqueryPageName}.html`)) {
      return `${platformsSiteRootPath}/${platform}/${jqueryPageName}.html`;
    }
    return `${platformsSiteRootPath}/${platform}/container.html`;
  }
  return `${platformsSiteRootPath}/${platform}/dist/${page}.html`;
}

export const multiPlatformTest = ({
  page, platforms = ['jquery', 'react', 'angular'],
}:
{
  page: string; platforms?: PlatformType[];
}) => (
  testName: string,
  testBody: (
    t: TestController,
    { platform, screenshotComparerOptions }:
    { platform: string; screenshotComparerOptions: Partial<IComparerOptions> }
  ) => Promise<any>,
): MultiPlatformTest => {
  const wrappedTest = new MultiPlatformTest();
  platforms.forEach((platform) => {
    const pageUrl = getPageFilePath(platform, page);
    const testOptions = {
      platform,
      screenshotComparerOptions: { screenshotsRelativePath: `/screenshots/${platform}` },
    };
    test
      .meta({ renovation: true })
      .page(pathToFileURL(pageUrl).href)(
        `${platform}:${testName}`,
        (t) => testBody(t, testOptions),
      )
      .before((t) => wrappedTest.beforeFn?.(t, testOptions))
      .after((t) => wrappedTest.afterFn?.(t, testOptions));
  });
  return wrappedTest;
};
