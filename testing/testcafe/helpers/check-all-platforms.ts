import { IComparerOptions } from 'devextreme-screenshot-comparer/build/src/options';
import { resolve } from 'path';
import { ClientFunction } from 'testcafe';
import url from './getPageUrl';

const platformsSiteRootPath = resolve('./testing/renovation/platforms');

async function prepareComponentOptions(componentOptions: any) {
  await ClientFunction(
    () => {
      (window as any).componentOptions = componentOptions ?? { };
    },
    {
      dependencies: {
        componentOptions,
      },
    },
  )();
}

const cloneTest = (
  page: string,
  platforms: ('react' | 'angular' | 'vue')[] = ['react', 'angular', 'vue'],
  componentOptions: any = null,
) => (
  testName: string,
  testBody: (
    t: TestController,
    { platform, screenshotComparerOptions }:
    { platform: string; screenshotComparerOptions: Partial<IComparerOptions> }
  ) => Promise<any>,
): void => {
  platforms.forEach((platform) => {
    const pageUrl = url(`${platformsSiteRootPath}/${platform}/dist`, `${page}.html`);
    test
      .page(pageUrl)(
        `${platform}: ${testName}`,
        (t) => testBody(t, {
          platform,
          screenshotComparerOptions: { screenshotsRelativePath: `/screenshots/${platform}` },
        }),
      )
      .before(async () => prepareComponentOptions(componentOptions));
  });
};

export default cloneTest;
