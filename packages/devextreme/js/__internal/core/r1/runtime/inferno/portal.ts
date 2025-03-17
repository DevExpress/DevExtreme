/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { createPortal } from 'inferno';

type PortalProps = {
  container?: HTMLElement | null;
  children: any;
};
export const Portal = ({ container, children }: PortalProps): any => {
  if (container) {
    return createPortal(children, container);
  }
  return null;
};
