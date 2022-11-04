import { PagerStore, SelectPageAction, SelectPageSizeAction } from '@devexpress/core/pager';
import { callPropCallback } from '../../../internal/index';
import { DxPagerProps } from '../types/public/index';

const selectedPageChangeControlled = (props: DxPagerProps): (value: number) => void => (value) => callPropCallback(props.selectedPageChange, value);

const selectedPageChangeUncontrolled = (
    store: PagerStore,
    props: DxPagerProps
): (value: number) => void => (value) => {
    store.dispatch(new SelectPageAction(value));
    const newState = store.getState();
    callPropCallback(props.selectedPageChange, newState.pageNumber.selected);
};

const selectedPageSizeChangeControlled = (props: DxPagerProps): (value: number) => void => (value) => callPropCallback(props.selectedPageSizeChange, value);

const selectedPageSizeChangeUncontrolled = (
    store: PagerStore,
    props: DxPagerProps
): (value: number) => void => (value) => {
    store.dispatch(new SelectPageSizeAction(value));
    const newState = store.getState();
    callPropCallback(props.selectedPageSizeChange, newState.pageSize.selected);
};

export {
    selectedPageSizeChangeControlled,
    selectedPageSizeChangeUncontrolled,
    selectedPageChangeUncontrolled,
    selectedPageChangeControlled
};
