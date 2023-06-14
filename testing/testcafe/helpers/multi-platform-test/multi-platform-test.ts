// eslint-disable-next-line max-classes-per-file
import { IComparerOptions } from 'devextreme-screenshot-comparer/build/src/options';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { pathToFileURL } from 'url';
import type { PlatformType } from './platform-type';

const platformsSiteRootPath = resolve('./testing/renovation/platforms');
export class MultiPlatformTest {
  beforeFn!: (t: TestController, { platform: PlatformType }) => Promise<void>;

  afterFn!: (t: TestController, { platform: PlatformType }) => Promise<void>;

  before(fn: (t: TestController, { platform: PlatformType }) => Promise<void>): this {
    this.beforeFn = fn;
    return this;
  }

  after(fn: (t: TestController, { platform: PlatformType }) => Promise<void>): this {
    this.afterFn = fn;
    return this;
  }
}

function getPageFilePath(platform: PlatformType, page: string): string {
  if (platform === 'jquery') {
    const jqueryPageName = page.lastIndexOf('/') === -1 ? page : page.slice(page.lastIndexOf('/') + 1);
    const pathToSpecialPage = `${platformsSiteRootPath}/jquery/${jqueryPageName}.html`;
    if (existsSync(pathToSpecialPage)) {
      return `${platformsSiteRootPath}/jquery/${jqueryPageName}.html`;
    }
    return `${platformsSiteRootPath}/jquery/container.html`;
  }
  return `${platformsSiteRootPath}/${platform}/dist/${page}.html`;
}

function getTestingPlatforms(platforms: PlatformType[]): PlatformType[] {
  const { platform: testingPlatform } = process.env;

  return testingPlatform
    ? platforms.filter((t) => t === testingPlatform)
    : platforms;
}

export const multiPlatformTest = ({
  page, platforms = ['jquery', 'react'],
}:
{
  page: string; platforms?: PlatformType[];
}) => (
  testName: string,
  testBody: (
    t: TestController,
    { platform, screenshotComparerOptions }:
    { platform: PlatformType; screenshotComparerOptions: Partial<IComparerOptions> }
  ) => Promise<any>,
): MultiPlatformTest => {
  const wrappedTest = new MultiPlatformTest();
  getTestingPlatforms(platforms).forEach((platform) => {
    const pageUrl = getPageFilePath(platform, page);
    const testOptions: {
      platform: PlatformType; screenshotComparerOptions: Partial<IComparerOptions>;
    } = {
      platform,
      screenshotComparerOptions: {
        screenshotsRelativePath: `/screenshots/${platform}`,
        destinationRelativePath: `/artifacts/compared-screenshots/${platform}`,
      },
    };
    test
      .meta({ renovation: 'true' })
      .page(pathToFileURL(pageUrl).href)(
        `${platform}:${testName}`,
        (t) => testBody(t, testOptions),
      )
      .before((t) => wrappedTest.beforeFn?.(t, testOptions))
      .after((t) => wrappedTest.afterFn?.(t, testOptions));
  });
  return wrappedTest;
};
