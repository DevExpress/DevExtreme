import type { PagerBase } from '@js/ui/pagination';

import { Pager } from '../inferno_wrappers/pager';

export type PagerProps = PagerBase & { visible: boolean };

export function PagerView(props: PagerProps): JSX.Element {
  return (
    props.visible ? <Pager {...props}></Pager> : <></>
  );
}
