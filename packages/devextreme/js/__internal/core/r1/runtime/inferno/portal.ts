import { createPortal } from 'inferno';

type PortalProps = {
  // eslint-disable-next-line react/require-default-props
  container?: HTMLElement | null;
  children: any;
};
export const Portal = ({ container, children }: PortalProps): any => {
  if (container) {
    return createPortal(children, container);
  }
  return null;
};
