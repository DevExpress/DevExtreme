import { h, createRef } from 'preact';
import { mount } from 'enzyme';
import PagerComponent, { PagerProps } from '../../../js/renovation/pager/pager.p';
import { PageSizeSelectorProps } from '../../../js/renovation/pager/page-size-selector';
import { PageIndexSelectorProps } from '../../../js/renovation/pager/page-index-selector';
import { InfoTextProps } from '../../../js/renovation/pager/info';

const pageSizeComp = jest.fn();
jest.mock('../../../js/renovation/pager/page-size-selector.p', () => {
    return (...args) => pageSizeComp(args);
});

const pageIndexSelector = jest.fn();
jest.mock('../../../js/renovation/pager/page-index-selector.p', () => {
    return (...args) => pageIndexSelector(args);
});

const InfoTextComp = jest.fn();
jest.mock('../../../js/renovation/pager/info.p', () => {
    return (...args) => InfoTextComp(args);
});
type PagerPropsType = Partial<typeof PagerProps>;

describe('Pager size selector', () => {
    const render = (props: PagerPropsType) => mount(<PagerComponent {...props as typeof PagerProps} />).childAt(0);
    beforeEach(() => {
        pageSizeComp.mockClear();
        pageIndexSelector.mockClear();
        InfoTextComp.mockClear();
    });
    it('render pager', () => {
        const comp = render({});
        expect(comp.props()).toMatchObject({ className: 'dx-pager' });
        expect(comp.childAt(0).props()).toMatchObject({ pageSize: 5 } as PageSizeSelectorProps);
        expect(comp.childAt(1).childAt(0).props()).toMatchObject({ pageIndex: 0 } as PageIndexSelectorProps);
        expect(comp.childAt(1).childAt(1).props()).toMatchObject({ infoTextMessageTemplate: 'Page {0} of {1} ({2} items)' } as InfoTextProps);
        expect(pageSizeComp).toHaveBeenCalledTimes(1);
        expect(pageIndexSelector).toHaveBeenCalledTimes(1);
        expect(InfoTextComp).toHaveBeenCalledTimes(1);
    });
    it.skip('change page size', () => {
        const pageSizeChangeHandler = jest.fn() as any;
        const comp = render({ pageSizeChange: pageSizeChangeHandler, pageSize: 5 });
        expect(pageSizeComp).toHaveBeenCalledTimes(1);
        (comp.childAt(0).props() as PageSizeSelectorProps).pageSizeChanged(10);
        expect(pageSizeChangeHandler).toBeCalledTimes(1);
        // expect(pageSizeComp).toHaveBeenCalledTimes(2);
        expect(comp.childAt(0).props()).toMatchObject({ pageSize: 10 } as PageSizeSelectorProps);
    });
});
