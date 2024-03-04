import type { dxElementWrapper } from '@js/core/renderer';

import type ResizeHandle from '../resize_handle';

export function getComponentInstance($element: dxElementWrapper): ResizeHandle {
  const componentName = $element.data?.('dxComponents')[0];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return componentName && $element.data?.(`${componentName}`);
}
