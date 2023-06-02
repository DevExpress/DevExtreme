import { isPlainObject, type } from '../../../../core/utils/type';

const defaultNotDeepCopyArrays: string[] = [
  'dataSource',
  'selectedRowKeys',
];

interface ResultItem {
  path: string;
  value: unknown;
  previousValue: unknown;
}

const propsToIgnore = {
  integrationOptions: true,
};

function getDiffItem(key, value, previousValue): ResultItem {
  return { path: key, value, previousValue };
}

function compare(resultPaths: ResultItem[],
  item1,
  item2,
  key: string,
  fullPropName: string,
  notDeepCopyArrays: string[]): void {
  if (propsToIgnore[key]) {
    return;
  }

  const type1 = type(item1);
  const type2 = type(item2);
  if (item1 === item2) return;
  if (type1 !== type2) {
    resultPaths.push(getDiffItem(key, item2, item1));
  } else if (type1 === 'object') {
    if (!isPlainObject(item2)) {
      resultPaths.push(getDiffItem(key, item2, item1));
    } else {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const diffPaths = objectDiffs(item1, item2, fullPropName, notDeepCopyArrays);
      resultPaths.push(...diffPaths.map((item) => ({ ...item, path: `${key}.${item.path}` })));
    }
  } else if (type1 === 'array') {
    const notDeepCopy = notDeepCopyArrays.some((prop) => fullPropName.includes(prop));
    if (notDeepCopy && item1 !== item2) {
      resultPaths.push(getDiffItem(key, item2, item1));
    } else if ((item1 as []).length !== (item2 as []).length) {
      resultPaths.push(getDiffItem(key, item2, item1));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const diffPaths = objectDiffs(item1, item2, fullPropName, notDeepCopyArrays);
      ([] as ResultItem[]).push.apply(resultPaths,
        diffPaths.map((item) => ({ ...item, path: `${key}${item.path}` })));
    }
  } else {
    resultPaths.push(getDiffItem(key, item2, item1));
  }
}

const objectDiffsFiltered = (propsEnumerator: (string) => string[]) => (
  oldProps: Record<string, unknown>,
  props: Record<string, unknown>,
  fullPropName: string,
  notDeepCopyArrays: string[],
):
ResultItem[] => {
  const resultPaths: ResultItem[] = [];
  const processItem = !Array.isArray(oldProps)
    ? (propName: string): void => {
      compare(resultPaths, oldProps[propName], props[propName], propName, `${fullPropName}.${propName}`, notDeepCopyArrays);
    } : (propName: string): void => {
      compare(resultPaths, oldProps[propName], props[propName], `[${propName}]`, `${fullPropName}.${propName}`, notDeepCopyArrays);
    };

  propsEnumerator(oldProps).forEach(processItem);
  Object.keys(props)
    .filter((propName) => !Object.prototype.hasOwnProperty.call(oldProps, propName)
      && oldProps[propName] !== props[propName])
    .forEach((propName) => {
      resultPaths.push({
        path: propName,
        value: props[propName],
        previousValue: oldProps[propName],
      });
    });
  return resultPaths;
};

const objectDiffs = objectDiffsFiltered((oldProps) => Object.keys(oldProps));
const reactProps = {
  key: true, ref: true, children: true, style: true,
};
const objectDiffsWithoutReactProps = objectDiffsFiltered((prop) => Object.keys(prop)
  .filter((p) => !reactProps[p]));

export function getUpdatedOptions(
  // eslint-disable-next-line @typescript-eslint/ban-types
  oldProps: {},
  // eslint-disable-next-line @typescript-eslint/ban-types
  props: {},
  notDeepCopyArrays: string[] = defaultNotDeepCopyArrays,
): ResultItem[] {
  return objectDiffsWithoutReactProps(oldProps, props, '', notDeepCopyArrays);
}
