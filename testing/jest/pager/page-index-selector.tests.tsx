/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from 'preact';
import { shallow } from 'enzyme';
import PageIndexSelector, { viewFunction as PageIndexSelectorComponent } from '../../../js/renovation/pager/page-index-selector';

describe('Page index selector', () => {
  describe('View', () => {
    const defaultProps = {
      renderNavButtons: true,
      prevClassName: 'prevClassName',
      navigateToPrevPage: jest.fn(),
      nextClassName: 'nextClassName',
      navigateToNextPage: jest.fn(),
      props: {
        isLargeDisplayMode: true,
        maxPagesCount: 10,
        pageCount: 10,
        pageIndex: 1,
        pageIndexChange: jest.fn(),
        pagesCountText: 'Of',
        rtlEnabled: true,
      },
    } as Partial<PageIndexSelector>;
    it('renderNavButtons: true, isLargeDisplayMode:true', () => {
      const props = { ...defaultProps };

      const tree = shallow(<PageIndexSelectorComponent {...props as any} /> as any);
      const pages = tree.childAt(1);
      const prevButton = tree.childAt(0);
      const nextButton = tree.childAt(2);

      expect(tree.children()).toHaveLength(3);
      expect(pages.props()).toEqual({
        children: [],
        maxPagesCount: 10,
        pageCount: 10,
        pageIndex: 1,
        pageIndexChange: props.props?.pageIndexChange,
        rtlEnabled: true,
      });
      expect(prevButton.props()).toEqual({
        children: [], className: 'prevClassName', label: 'Previous page', onClick: props.navigateToPrevPage,
      });
      expect(nextButton.props()).toEqual({
        children: [], className: 'nextClassName', label: 'Next page', onClick: props.navigateToNextPage,
      });
    });
    it('renderNavButtons: false, isLargeDisplayMode: true', () => {
      const props = {
        ...defaultProps,
        renderNavButtons: false,
      } as Partial<PageIndexSelector>;

      const tree = shallow(<PageIndexSelectorComponent {...props as any} /> as any);
      const pages = tree.childAt(0);

      expect(tree.children()).toHaveLength(1);
      expect(pages.props()).toEqual({
        children: [],
        maxPagesCount: 10,
        pageCount: 10,
        pageIndex: 1,
        pageIndexChange: props.props?.pageIndexChange,
        rtlEnabled: true,
      });
    });
    it('renderNavButtons: false, isLargeDisplayMode: false', () => {
      const props = {
        ...defaultProps,
        renderNavButtons: false,
        props: { ...defaultProps.props, isLargeDisplayMode: false },
      } as Partial<PageIndexSelector>;

      const tree = shallow(<PageIndexSelectorComponent {...props as any} /> as any);
      const pages = tree.childAt(0);

      expect(tree.children()).toHaveLength(1);
      expect(pages.props()).toEqual({
        children: [],
        pageCount: 10,
        pageIndex: 1,
        pageIndexChange: props.props?.pageIndexChange,
        pagesCountText: 'Of',
        rtlEnabled: true,
      });
    });
  });
  describe('Logic', () => {
    it('renderNavButtons', () => {
      const component = new PageIndexSelector({
        isLargeDisplayMode: true,
        showNavigationButtons: true,
      });
      expect(component.renderNavButtons).toBe(true);
      component.props.isLargeDisplayMode = false;
      expect(component.renderNavButtons).toBe(true);
      component.props.showNavigationButtons = false;
      expect(component.renderNavButtons).toBe(true);
      component.props.isLargeDisplayMode = true;
      expect(component.renderNavButtons).toBe(false);
    });
    it('nextClassName, rtlEnabled: false', () => {
      const component = new PageIndexSelector({ rtlEnabled: false, pageIndex: 3, pageCount: 5 });
      expect(component.nextClassName).toBe('dx-navigate-button dx-next-button');
      component.props.pageIndex = 4;
      expect(component.nextClassName).toBe('dx-button-disable dx-navigate-button dx-next-button');
    });
    it('prevClassName, rtlEnabled: false', () => {
      const component = new PageIndexSelector({ rtlEnabled: false, pageIndex: 1 });
      expect(component.prevClassName).toBe('dx-navigate-button dx-prev-button');
      component.props.pageIndex = 0;
      expect(component.prevClassName).toBe('dx-button-disable dx-navigate-button dx-prev-button');
    });
    it('nextClassName, rtlEnabled: true', () => {
      const component = new PageIndexSelector({ rtlEnabled: true, pageIndex: 1 });
      expect(component.nextClassName).toBe('dx-navigate-button dx-next-button');
      component.props.pageIndex = 0;
      expect(component.nextClassName).toBe('dx-button-disable dx-navigate-button dx-next-button');
    });
    it('prevClassName, rtlEnabled: true', () => {
      const component = new PageIndexSelector({ rtlEnabled: true, pageIndex: 3, pageCount: 5 });
      expect(component.prevClassName).toBe('dx-navigate-button dx-prev-button');
      component.props.pageIndex = 4;
      expect(component.prevClassName).toBe('dx-button-disable dx-navigate-button dx-prev-button');
    });
    it('navigateToNextPage, rtlEnabled: false, can navigate', () => {
      const pageIndexChange = jest.fn();
      const component = new PageIndexSelector({
        rtlEnabled: false, pageIndex: 3, pageCount: 5, pageIndexChange,
      });
      expect(pageIndexChange).not.toBeCalled();
      component.navigateToNextPage();
      expect(pageIndexChange).toBeCalledWith(4);
    });

    it('navigateToNextPage, rtlEnabled: false, cannot navigate', () => {
      const pageIndexChange = jest.fn();
      const component = new PageIndexSelector({
        rtlEnabled: false, pageIndex: 4, pageCount: 5, pageIndexChange,
      });
      component.navigateToNextPage();
      expect(pageIndexChange).not.toBeCalled();
    });

    it('navigateToNextPage, rtlEnabled: true, can navigate', () => {
      const pageIndexChange = jest.fn();
      const component = new PageIndexSelector({
        rtlEnabled: true, pageIndex: 1, pageCount: 5, pageIndexChange,
      });
      expect(pageIndexChange).not.toBeCalled();
      component.navigateToNextPage();
      expect(pageIndexChange).toBeCalledWith(0);
    });
    it('navigateToNextPage, rtlEnabled: true, cannot navigate', () => {
      const pageIndexChange = jest.fn();
      const component = new PageIndexSelector({
        rtlEnabled: true, pageIndex: 0, pageCount: 5, pageIndexChange,
      });
      component.navigateToNextPage();
      expect(pageIndexChange).not.toBeCalled();
    });
    it('navigateToPrevPage, rtlEnabled: false, can navigate', () => {
      const pageIndexChange = jest.fn();
      const component = new PageIndexSelector({
        rtlEnabled: false, pageIndex: 1, pageCount: 5, pageIndexChange,
      });
      expect(pageIndexChange).not.toBeCalled();
      component.navigateToPrevPage();
      expect(pageIndexChange).toBeCalledWith(0);
    });
    it('navigateToPrevPage, rtlEnabled: false, cannot navigate', () => {
      const pageIndexChange = jest.fn();
      const component = new PageIndexSelector({
        rtlEnabled: false, pageIndex: 0, pageCount: 5, pageIndexChange,
      });
      expect(pageIndexChange).not.toBeCalled();
      component.navigateToPrevPage();
      expect(pageIndexChange).not.toBeCalled();
    });
    it('navigateToPrevPage, rtlEnabled: true, can navigate', () => {
      const pageIndexChange = jest.fn();
      const component = new PageIndexSelector({
        rtlEnabled: true, pageIndex: 3, pageCount: 5, pageIndexChange,
      });
      expect(pageIndexChange).not.toBeCalled();
      component.navigateToPrevPage();
      expect(pageIndexChange).toBeCalledWith(4);
    });
    it('navigateToPrevPage, rtlEnabled: true, cannot navigate', () => {
      const pageIndexChange = jest.fn();
      const component = new PageIndexSelector({
        rtlEnabled: true, pageIndex: 4, pageCount: 5, pageIndexChange,
      });
      expect(pageIndexChange).not.toBeCalled();
      component.navigateToPrevPage();
      expect(pageIndexChange).not.toBeCalled();
    });
  });
});
