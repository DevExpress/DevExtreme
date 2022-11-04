import { useMemo } from 'react';
import { DxPagerProps } from '../types/public/index';

const useIsControlled = (props: DxPagerProps): boolean => useMemo(() => props.selectedPage !== undefined
    && props.selectedPageSize !== undefined, []);

export { useIsControlled };
