import {
    DxPagerPageNumberItemViewProps,
    DxPagerPageNumberViewProps,
    DxPagerPageSizeItemViewProps,
    DxPagerPageSizeViewProps,
    DxPagerViewProps
} from '../../views/index';

type PagerTemplate = (props: DxPagerViewProps) => JSX.Element;
type PageNumberTemplate = (props: DxPagerPageNumberViewProps) => JSX.Element;
type PageNumberItemTemplate = (props: DxPagerPageNumberItemViewProps) => JSX.Element;
type PageSizeTemplate = (props: DxPagerPageSizeViewProps) => JSX.Element;
type PageSizeItemTemplate = (props: DxPagerPageSizeItemViewProps) => JSX.Element;

export type {
    PagerTemplate,
    PageNumberTemplate,
    PageSizeTemplate,
    PageNumberItemTemplate,
    PageSizeItemTemplate
};
