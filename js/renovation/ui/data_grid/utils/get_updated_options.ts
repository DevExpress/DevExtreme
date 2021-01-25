import { DataGridProps } from '../common/data_grid_props';

interface ResultItem {
  path: string;
  value: unknown;
}

function getDiffItem(key, value): ResultItem {
  return { path: key, value };
}

function compare(resultPaths: ResultItem[], item1, item2, key: string): void {
  const type1 = Object.prototype.toString.call(item1);
  const type2 = Object.prototype.toString.call(item2);
  if (item1 === item2) return;
  if (type1 !== '[object Undefined]' && type2 === '[object Undefined]') {
    resultPaths.push(getDiffItem(key, {}));
  } else if (type1 !== type2) {
    resultPaths.push(getDiffItem(key, item2));
  } else if (type1 === '[object Object]') {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const diffPaths = objectDiffs(item1, item2);
    resultPaths.push(...diffPaths.map((item) => ({ path: `${key}.${item.path}`, value: item.value })));
  } else if (type1 === '[object Array]') {
    if ((item1 as []).length !== (item2 as []).length) {
      resultPaths.push(getDiffItem(key, item2));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const diffPaths = objectDiffs(item1, item2);
      ([] as ResultItem[]).push.apply(resultPaths,
        diffPaths.map((item) => ({ path: `${key}${item.path}`, value: item.value })));
    }
  } else {
    resultPaths.push(getDiffItem(key, item2));
  }
}

const objectDiffsFn = (propsEnumerator: (string) => string[]) => (oldProps: {}, props: {}):
ResultItem[] => {
  if (!props) {
    return [];
  }
  const resultPaths: ResultItem[] = [];
  const processItem = !Array.isArray(oldProps)
    ? (propName): void => compare(resultPaths, oldProps[propName], props[propName], propName)
    : (propName): void => compare(resultPaths, oldProps[propName], props[propName], `[${propName}]`);

  propsEnumerator(oldProps).forEach(processItem);
  Object.keys(props)
    .filter((propName) => !oldProps[propName] && oldProps[propName] !== props[propName])
    .forEach((propName) => {
      resultPaths.push({ path: propName, value: props[propName] });
    });
  return resultPaths;
};

const objectDiffs = objectDiffsFn((oldProps) => Object.keys(oldProps));
const reactProps = { key: true, ref: true, children: true };
export function getUpdatedOptions(oldProps: DataGridProps, props: DataGridProps):
ResultItem[] {
  return objectDiffsFn((prop) => Object.keys(prop).filter((p) => !reactProps[p]))(oldProps, props);
}
