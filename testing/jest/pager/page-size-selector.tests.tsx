/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from 'preact';
import { mount } from 'enzyme';
import type { PageSizeSelectorPropsType } from '../../../js/renovation/pager/page-size-selector.p';
import PageSizesComponent from '../../../js/renovation/pager/page-size-selector.p';
import SelectBox from '../../../js/renovation/select-box.p';
import {
  PAGER_PAGE_SIZES_CLASS, PAGER_SELECTED_PAGE_SIZE_CLASS, PAGER_PAGE_SIZE_CLASS,
} from '../../../js/renovation/pager/page-size-selector';
import getElementComputedStyle from '../../../js/renovation/pager/get-computed-style.p';

jest.mock('../../../js/renovation/pager/get-computed-style.p');
jest.mock('../../../js/renovation/select-box', () => { });
jest.mock('../../../js/renovation/select-box.p', () => () => 'selectbox');
jest.mock('../../../js/renovation/pager/light-button.p', () => (props) => props.children);

describe('Pager size selector', () => {
  function render(props: PageSizeSelectorPropsType) {
    return mount(<PageSizesComponent {...props} />).childAt(0);
  }
  it('render large page sizes', () => {
    const comp = render({ isLargeDisplayMode: true, pageSizes: [5, 10, 20], pageSize: 5 });
    expect(comp.prop('className')).toBe(PAGER_PAGE_SIZES_CLASS);
    expect(comp.children()).toHaveLength(3);
    expect(comp.children().map((c) => c.text())).toEqual(['5', '10', '20']);
    expect(comp.children().map((c) => c.prop('className'))).toEqual([
      PAGER_SELECTED_PAGE_SIZE_CLASS,
      PAGER_PAGE_SIZE_CLASS,
      PAGER_PAGE_SIZE_CLASS,
    ]);
  });
  it('render large page sizes rtlEnabled', () => {
    const comp = render({
      rtlEnabled: true, isLargeDisplayMode: true, pageSizes: [5, 10, 20], pageSize: 5,
    });
    expect(comp.children().map((c) => c.text())).toEqual(['20', '10', '5']);
  });
  it('change pagesize in large selector', () => {
    const pageSizeHandler = jest.fn();
    const comp = render({
      isLargeDisplayMode: true, pageSizes: [5, 10], pageSize: 5, pageSizeChanged: pageSizeHandler,
    });
    (comp.find({ children: '10' }).prop('onClick'))();
    expect(pageSizeHandler).toBeCalledWith(10);
  });
  it('render small page sizes text', () => {
    const comp = render({ isLargeDisplayMode: false, pageSizes: [5, 10], pageSize: 5 });
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
  it('render small page sizes selectBox width', () => {
    (getElementComputedStyle as jest.Mock).mockReturnValue({ minWidth: '42px' });
    const comp = render({
      isLargeDisplayMode: false, pageSizes: [5, 10, 1000],
    });
    expect(comp.children().at(0).props().width).toBe(42 + 10 * 4);
  });

  it('render small page sizes rtlEnabled', () => {
    const comp = render({
      rtlEnabled: true, isLargeDisplayMode: false, pageSizes: [5, 10], pageSize: 5,
    });
    expect(comp.children().at(0).props()).toMatchObject({ rtlEnabled: true });
  });
  it('change pagesize in small selector', () => {
    const pageSizeHandler = jest.fn();
    const comp = render({
      isLargeDisplayMode: false, pageSizes: [5, 10], pageSize: 5, pageSizeChanged: pageSizeHandler,
    });
    (comp.find(SelectBox).prop('valueChange'))(10);
    expect(pageSizeHandler).toBeCalledWith(10);
  });
});
