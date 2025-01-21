import type { PagerBase } from '@js/ui/pagination';
import type { InfernoNode } from 'inferno';

import { Pager } from '../inferno_wrappers/pager';

export type PagerProps = PagerBase & { visible: boolean };

export function PagerView(props: PagerProps): InfernoNode {
  return (
    props.visible && <Pager {...props}></Pager>
  );
}
