import $ from '@js/core/renderer';
// eslint-disable-next-line import/no-extraneous-dependencies
import ko from 'knockout';

// eslint-disable-next-line @stylistic/max-len
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
export const getClosestNodeWithContext = (node) => {
  const context = ko.contextFor(node);
  if (!context && node.parentNode) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return getClosestNodeWithContext(node.parentNode);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return node;
};

// eslint-disable-next-line @stylistic/max-len
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
export const getClosestNodeWithKoCreation = (node) => {
  const $el = $(node);
  // @ts-expect-error
  const data = $el.data();
  // @ts-expect-error
  const hasFlag = data?.dxKoCreation;
  if (hasFlag) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return node;
  }
  if (node.parentNode) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return getClosestNodeWithKoCreation(node.parentNode);
  }
  return null;
};
