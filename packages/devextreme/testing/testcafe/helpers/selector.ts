import { Selector as SelectorBase } from 'testcafe';

const Selector: SelectorFactory = (id, options?) => {
  if (process.env.shadowDom === 'true' && typeof id === 'string') {
    const shadowRoot = SelectorBase('#parentContainer').shadowRoot();

    return SelectorBase(shadowRoot.find(id));
  }

  return SelectorBase(id, options);
};

export {
  Selector,
};
