import { ClientFunction } from 'testcafe';

type WindowCssRuntimeExtended =
  Window
  & typeof globalThis
  & {
    runtimeCssNodes?: HTMLStyleElement[];
  };

export const addRuntimeCss = (cssString: string): Promise<void> => ClientFunction(() => {
  const extendedWindow = window as WindowCssRuntimeExtended;
  const styleNode = document.createElement('style');

  styleNode.innerHTML = cssString;
  document.getElementsByTagName('head')[0].appendChild(styleNode);

  extendedWindow.runtimeCssNodes ??= [];
  extendedWindow.runtimeCssNodes.push(styleNode);
}, { dependencies: { cssString } })();

export const clearRuntimeCss = (): Promise<void> => ClientFunction(() => {
  const extendedWindow = window as WindowCssRuntimeExtended;

  extendedWindow.runtimeCssNodes?.forEach((styleNode) => {
    styleNode?.parentNode?.removeChild(styleNode);
  });
  extendedWindow.runtimeCssNodes = [];
})();
