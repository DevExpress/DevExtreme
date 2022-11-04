import { ItemVM } from '../common/index';
import { FAKE_ITEM_LABEL, VISIBLE_PAGE_COUNT } from './consts';

function getFakePageItem(value: number, fakeTemplate: unknown): ItemVM {
    return {
        label: FAKE_ITEM_LABEL,
        value,
        selectable: false,
        selected: false,
        template: fakeTemplate
    };
}

function getPageItemsVmShort(selectedPage: number, pageCount: number, template: unknown): ItemVM[] {
    const result: ItemVM[] = [];

    for (let idx = 1; idx <= pageCount; idx++) {
        result.push({
            label: idx.toString(),
            value: idx,
            selectable: true,
            selected: idx === selectedPage,
            template
        });
    }

    return result;
}

function getPageItemsVmStart(
    selectedPage: number,
    pageCount: number,
    template: unknown,
    fakeTemplate: unknown
): ItemVM[] {
    const result: ItemVM[] = [];

    for (let idx = 1; idx <= 2 * VISIBLE_PAGE_COUNT + 1 && idx <= pageCount; idx++) {
        result.push({
            label: idx.toString(),
            value: idx,
            selectable: true,
            selected: idx === selectedPage,
            template
        });
    }

    result.push(getFakePageItem(pageCount - 1, fakeTemplate));
    result.push({
        label: pageCount.toString(),
        value: pageCount,
        selectable: true,
        selected: false,
        template
    });

    return result;
}

function getPageItemsVmMiddle(
    selectedPage: number,
    pageCount: number,
    template: unknown,
    fakeTemplate: unknown
): ItemVM[] {
    const result: ItemVM[] = [];

    result.push({
        label: '1',
        value: 1,
        selectable: true,
        selected: false,
        template
    });
    result.push(getFakePageItem(2, fakeTemplate));

    for (let idx = selectedPage - VISIBLE_PAGE_COUNT; idx <= selectedPage + VISIBLE_PAGE_COUNT; idx++) {
        result.push({
            label: idx.toString(),
            value: idx,
            selectable: true,
            selected: idx === selectedPage,
            template
        });
    }

    result.push(getFakePageItem(pageCount - 1, fakeTemplate));
    result.push({
        label: pageCount.toString(),
        value: pageCount,
        selectable: true,
        selected: false,
        template
    });

    return result;
}

function getPageItemsVmEnd(
    selectedPage: number,
    pageCount: number,
    template: unknown,
    fakeTemplate: unknown
): ItemVM[] {
    const result: ItemVM[] = [];

    result.push({
        label: '1',
        value: 1,
        selectable: true,
        selected: false,
        template
    });
    result.push(getFakePageItem(2, fakeTemplate));

    for (let idx = pageCount - 2 * VISIBLE_PAGE_COUNT; idx <= pageCount; idx++) {
        result.push({
            label: idx.toString(),
            value: idx,
            selectable: true,
            selected: idx === selectedPage,
            template
        });
    }

    return result;
}

export {
    getFakePageItem,
    getPageItemsVmShort,
    getPageItemsVmStart,
    getPageItemsVmMiddle,
    getPageItemsVmEnd
};
