/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from 'preact';
import { shallow } from 'enzyme';
import Component, { PageIndexSelectorProps, PAGER_BUTTON_DISABLE_CLASS } from '../../../js/renovation/pager/page-index-selector';
import LightButton from '../../../js/renovation/pager/light-button';
import PagesLarge from '../../../js/renovation/pager/pages-large';
import SmallPages from '../../../js/renovation/pager/pages-small';

describe('Page index selector', () => {
  const render = (props: PageIndexSelectorProps) => {
    const root = shallow<Component>(<Component {...props} />);
    const PagesType = props.isLargeDisplayMode ? PagesLarge : SmallPages;
    return {
      root,
      pages: () => root.find(PagesType),
      prevButton: () => root.find(LightButton).at(0),
      nextButton: () => root.find(LightButton).at(1),
    };
  };
  it('render showNavigationButtons: true, isLargeDisplayMode:true', () => {
    const { root, prevButton, nextButton } = render({
      isLargeDisplayMode: true, showNavigationButtons: true, pageIndex: 5, pageCount: 10,
    });
    expect(root.find(LightButton)).toHaveLength(2);
    expect(prevButton().props()).toMatchObject({ className: 'dx-navigate-button dx-prev-button', label: 'Previous page' });
    expect(nextButton().props()).toMatchObject({ className: 'dx-navigate-button dx-next-button', label: 'Next page' });
  });
  it('render showNavigationButtons: false, isLargeDisplayMode:true', () => {
    const { root, pages } = render({
      isLargeDisplayMode: true,
      showNavigationButtons: false,
      pageIndex: 6,
      pageCount: 16,
      maxPagesCount: 4,
    });
    expect(root.find(LightButton)).toHaveLength(0);
    expect(pages().props()).toMatchObject({
      pageCount: 16, pageIndex: 6, rtlEnabled: false, maxPagesCount: 4,
    });
  });
  it('render showNavigationButtons: true, isLargeDisplayMode:false', () => {
    const { root, pages } = render({
      isLargeDisplayMode: false, showNavigationButtons: true, pageIndex: 5, pageCount: 10, pagesCountText: 'Off',
    });
    expect(root.find(LightButton)).toHaveLength(2);
    expect(pages().props()).toMatchObject({
      pageCount: 10, pageIndex: 5, rtlEnabled: false, pagesCountText: 'Off',
    });
  });
  it('render change from large to small', () => {
    const { root } = render({
      isLargeDisplayMode: true, showNavigationButtons: false, pageIndex: 5, pageCount: 10,
    });
    expect(root.find(LightButton)).toHaveLength(0);
    root.setProps({ isLargeDisplayMode: false, showNavigationButtons: false });
    expect(root.find(LightButton)).toHaveLength(2);
  });
  it('enable/disable navigation button', async () => {
    const { root, prevButton, nextButton } = render({
      rtlEnabled: false,
      pageIndex: 0,
      pageCount: 10,
      isLargeDisplayMode: true,
      showNavigationButtons: true,
    });
    expect(prevButton().props().className.indexOf(PAGER_BUTTON_DISABLE_CLASS)).not.toBe(-1);
    expect(nextButton().props().className.indexOf(PAGER_BUTTON_DISABLE_CLASS)).toBe(-1);
    root.setProps({
      rtlEnabled: false,
      pageIndex: 9,
      pageCount: 10,
      isLargeDisplayMode: true,
      showNavigationButtons: true,
    });
    root.update();
    expect(prevButton().props().className.indexOf(PAGER_BUTTON_DISABLE_CLASS)).toBe(-1);
    expect(nextButton().props().className.indexOf(PAGER_BUTTON_DISABLE_CLASS)).not.toBe(-1);

    root.setProps({
      rtlEnabled: true,
      pageIndex: 0,
      pageCount: 10,
      isLargeDisplayMode: true,
      showNavigationButtons: true,
    });
    root.update();
    expect(prevButton().props().className.indexOf(PAGER_BUTTON_DISABLE_CLASS)).toBe(-1);
    expect(nextButton().props().className.indexOf(PAGER_BUTTON_DISABLE_CLASS)).not.toBe(-1);
    root.setProps({
      rtlEnabled: true,
      pageIndex: 9,
      pageCount: 10,
      isLargeDisplayMode: true,
      showNavigationButtons: true,
    });
    root.update();
    expect(prevButton().props().className.indexOf(PAGER_BUTTON_DISABLE_CLASS)).not.toBe(-1);
    expect(nextButton().props().className.indexOf(PAGER_BUTTON_DISABLE_CLASS)).toBe(-1);
  });
  it('click to navigation buttons pageIndex = 0', () => {
    const pageIndexChangeHandler = jest.fn();
    const component = new Component({
      rtlEnabled: false,
      pageIndex: 0,
      pageCount: 3,
      pageIndexChange: pageIndexChangeHandler,
      isLargeDisplayMode: true,
      showNavigationButtons: true,
    });
    component.navigateToPrevPage();
    expect(pageIndexChangeHandler).not.toBeCalled();
    component.navigateToNextPage();
    expect(pageIndexChangeHandler).toBeCalled();
  });
  it('click to navigation buttons pageIndex = pageCount - 1', () => {
    const pageIndexChangeHandler = jest.fn();
    const component = new Component({
      rtlEnabled: false,
      pageIndex: 2,
      pageCount: 3,
      pageIndexChange: pageIndexChangeHandler,
      isLargeDisplayMode: true,
      showNavigationButtons: true,
    });
    component.navigateToNextPage();
    expect(pageIndexChangeHandler).not.toBeCalled();
    component.navigateToPrevPage();
    expect(pageIndexChangeHandler).toBeCalled();
  });
});
