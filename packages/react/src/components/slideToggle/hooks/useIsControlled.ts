import { useMemo } from 'react';
import { DxSlideToggleProps } from '../types/public/index';

const useIsControlled = (props: DxSlideToggleProps): boolean => useMemo(() => props.value !== undefined, []);

export { useIsControlled };
