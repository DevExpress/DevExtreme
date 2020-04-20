import { h, createRef } from 'preact';
import { mount, shallow } from 'enzyme';
import PageSizesComponent from '../../../js/renovation/pager/page-size-selector.p';
import { PageSizeSelectorInput, PAGER_PAGE_SIZES_CLASS, PAGER_SELECTED_PAGE_SIZE_CLASS, PAGER_PAGE_SIZE_CLASS } from '../../../js/renovation/pager/page-size-selector';

jest.mock('../../../js/renovation/select-box.p', () => {
    return (props) => {
        return 'selectbox';
    };
});

describe('Pager size selector', () => {
    const render = (props: PageSizeSelectorInput) => mount(<PageSizesComponent {...props} />).childAt(0);
    it('render large page sizes', () => {
        const comp = render({ isLargeDisplayMode: true, pageSizes: [5, 10, 20], pageSize: 5 } as PageSizeSelectorInput);
        expect(comp.prop('className')).toBe(PAGER_PAGE_SIZES_CLASS);
        expect(comp.children()).toHaveLength(3);
        expect(comp.children().map(c => c.text())).toEqual(['5', '10', '20']);
        expect(comp.children().map(c => c.prop('className'))).toEqual([
            PAGER_SELECTED_PAGE_SIZE_CLASS,
            PAGER_PAGE_SIZE_CLASS,
            PAGER_PAGE_SIZE_CLASS,
        ]);
    });
    it('render small page sizes text', () => {
        const comp = render({ isLargeDisplayMode: false, pageSizes: [5, 10], pageSize: 5 } as PageSizeSelectorInput);
        expect(comp.prop('className')).toBe(PAGER_PAGE_SIZES_CLASS);
        // expect(comp.children().find('selectbox')).toHaveLength(1);
        // expect(comp.children('selectbox')).toHaveLength(1);
        expect(comp.children().at(0).text()).toBe('selectbox');
        expect(comp.children().at(0).props()).toMatchObject({
            dataSource: [{ text: '5', value: 5 }, { text: '10', value: 10 }],
            displayExpr: 'text',
            value: 5,
            valueExpr: 'value',
        });
    });
});
