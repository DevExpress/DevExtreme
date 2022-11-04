import { PageNumberVM, ItemVM, PageSizeVM } from '@devexpress/core/pager';
import {
    PageNumberItemTemplate, PageNumberTemplate, PageSizeItemTemplate, PageSizeTemplate
} from './templates';

interface ItemReactVM<Template> extends ItemVM {
    template: Template;
}

interface PageNumberReactVM extends PageNumberVM {
    items: ItemReactVM<PageNumberItemTemplate>[];
    template: PageNumberTemplate;
}

interface PageSizeReactVM extends PageSizeVM {
    items: ItemReactVM<PageSizeItemTemplate>[];
    template: PageSizeTemplate;
}

export type {
    ItemReactVM,
    PageNumberReactVM,
    PageSizeReactVM
};
