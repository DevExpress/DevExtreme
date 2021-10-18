import { IComparerOptions } from 'devextreme-screenshot-comparer/build/src/options';
import { resolve } from 'path';
import * as Replicator from 'replicator';
import url from './getPageUrl';

const platformsSiteRootPath = resolve('./testing/renovation/platforms');

function prepareClientScripts(componentOptions: any): ClientScript[] {
  const encodedOptions = encodeURIComponent(new Replicator().encode(componentOptions));
  return [
    { content: 'module = { };' },
    { module: 'replicator' },
    { content: `localStorage.setItem('componentOptions', decodeURIComponent('${encodedOptions}'))` },
  ];
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
      .clientScripts(prepareClientScripts(componentOptions))
      .page(pageUrl)(
        `${platform}: ${testName}`,
        (t) => testBody(t, {
          platform,
          screenshotComparerOptions: { screenshotsRelativePath: `/screenshots/${platform}` },
        }),
      );
  });
};

export default cloneTest;
