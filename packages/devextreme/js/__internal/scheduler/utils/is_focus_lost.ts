import { domAdapter } from '@ts/core/m_dom_adapter';

export const isFocusLost = (): boolean => {
  const activeElement = domAdapter.getActiveElement();
  const body = domAdapter.getBody();

  return !activeElement
    || activeElement === body
    || !body.contains(activeElement);
};
