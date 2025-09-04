import { createContext } from '@ts/core/r1/runtime/inferno/index';
import type { RefObject } from 'inferno';

export interface CommonProps {
  rootElementRef: RefObject<HTMLDivElement>;
}

export const CommonPropsContext = createContext<CommonProps>({
  rootElementRef: { current: null },
});
