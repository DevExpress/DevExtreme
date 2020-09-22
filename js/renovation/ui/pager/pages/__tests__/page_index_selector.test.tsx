/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import { PageIndexSelector, viewFunction as PageIndexSelectorComponent } from '../page_index_selector';

describe('Page index selector', () => {
  describe('View', () => {
    const defaultComponentProps = (): PageIndexSelector['props'] => (
      {
        isLargeDisplayMode: true,
        maxPagesCount: 10,
        pageCount: 10,
        pageIndex: 1,
        pagesCountText: 'Of',
      } as PageIndexSelector['props']
    );
    const defaultProps = () => ({
      renderPrevButton: true,
      renderNextButton: true,
      prevClassName: 'prevClassName',
      navigateToPrevPage: jest.fn(),
      nextClassName: 'nextClassName',
      navigateToNextPage: jest.fn(),
      pageIndexChange: jest.fn(),
      props: defaultComponentProps(),
    } as Partial<PageIndexSelector> as PageIndexSelector);

    it('renderPrevButton: true, renderNextButton: true, isLargeDisplayMode:true', () => {
      const props = defaultProps();

      const tree = shallow(<PageIndexSelectorComponent {...props as any} />);
      const pages = tree.childAt(1);
      const prevButton = tree.childAt(0);
      const nextButton = tree.childAt(2);

      expect(tree.children()).toHaveLength(3);
      expect(pages.props()).toEqual({
        maxPagesCount: 10,
        pageCount: 10,
        pageIndex: 1,
        pageIndexChange: props.pageIndexChange,
      });
      expect(prevButton.props()).toEqual({
        className: 'prevClassName', label: 'Previous page', onClick: props.navigateToPrevPage,
      });
      expect(nextButton.props()).toEqual({
        className: 'nextClassName', label: 'Next page', onClick: props.navigateToNextPage,
      });
    });

    it('renderPrevButton: false, renderNextButton: true, isLargeDisplayMode: true', () => {
      const props = {
        ...defaultProps(),
        renderPrevButton: false,
        renderNextButton: true,
      } as Partial<PageIndexSelector>;

      const tree = shallow(<PageIndexSelectorComponent {...props as any} />);
      const pages = tree.childAt(0);
      const nextButton = tree.childAt(1);

      expect(tree.children()).toHaveLength(2);
      expect(pages.props()).toEqual({
        maxPagesCount: 10,
        pageCount: 10,
        pageIndex: 1,
        pageIndexChange: props.pageIndexChange,
      });
      expect(nextButton.props()).toEqual({
        className: 'nextClassName', label: 'Next page', onClick: props.navigateToNextPage,
      });
    });

    it('renderPrevButton: true, renderNextButton: false, isLargeDisplayMode: true', () => {
      const props = {
        ...defaultProps(),
        renderPrevButton: true,
        renderNextButton: false,
      } as Partial<PageIndexSelector>;

      const tree = shallow(<PageIndexSelectorComponent {...props as any} />);
      const prevButton = tree.childAt(0);
      const pages = tree.childAt(1);

      expect(tree.children()).toHaveLength(2);
      expect(prevButton.props()).toEqual({
        className: 'prevClassName', label: 'Previous page', onClick: props.navigateToPrevPage,
      });
      expect(pages.props()).toEqual({
        maxPagesCount: 10,
        pageCount: 10,
        pageIndex: 1,
        pageIndexChange: props.pageIndexChange,
      });
    });

    it('renderPrevButton: false, renderNextButton: false,isLargeDisplayMode: false', () => {
      const defProps = defaultProps();
      const props = {
        ...defProps,
        renderPrevButton: false,
        renderNextButton: false,
        props: { ...defProps.props, isLargeDisplayMode: false },
      } as Partial<PageIndexSelector>;

      const tree = shallow(<PageIndexSelectorComponent {...props as any} /> as any);
      const pages = tree.childAt(0);

      expect(tree.children()).toHaveLength(1);
      expect(pages.props()).toEqual({
        pageCount: 10,
        pageIndex: 1,
        pageIndexChange: props.pageIndexChange,
        pagesCountText: 'Of',
      });
    });
  });

  describe('Logic', () => {
    it('renderPrevButtons', () => {
      const component = new PageIndexSelector({
        isLargeDisplayMode: true,
        showNavigationButtons: true,
      });
      expect(component.renderPrevButton).toBe(true);
      component.props.isLargeDisplayMode = false;
      expect(component.renderPrevButton).toBe(true);
      component.props.showNavigationButtons = false;
      expect(component.renderPrevButton).toBe(true);
      component.props.isLargeDisplayMode = true;
      expect(component.renderPrevButton).toBe(false);
    });

    it('renderPrevButtons, hasKnownLastPage = true', () => {
      const component = new PageIndexSelector({
        hasKnownLastPage: true,
        isLargeDisplayMode: true,
        showNavigationButtons: true,
      });
      expect(component.renderNextButton).toBe(true);
      component.props.isLargeDisplayMode = false;
      expect(component.renderNextButton).toBe(true);
      component.props.showNavigationButtons = false;
      expect(component.renderNextButton).toBe(true);
      component.props.isLargeDisplayMode = true;
      expect(component.renderNextButton).toBe(false);
    });

    it('renderNextButton, hasKnownLastPage = false', () => {
      const component = new PageIndexSelector({
        isLargeDisplayMode: true,
        showNavigationButtons: false,
        hasKnownLastPage: false,
      });
      expect(component.renderNextButton).toBe(true);
    });

    it('nextClassName, rtlEnabled: false', () => {
      const component = new PageIndexSelector({
        pageIndex: 3, pageCount: 5, hasKnownLastPage: true,
      });
      component.config = { rtlEnabled: false };
      expect(component.nextClassName).toBe('dx-navigate-button dx-next-button');
      component.props.pageIndex = 4;
      expect(component.nextClassName).toBe('dx-button-disable dx-navigate-button dx-next-button');
    });

    it('prevClassName, rtlEnabled: false', () => {
      const component = new PageIndexSelector({
        pageIndex: 1, pageCount: 5, hasKnownLastPage: true,
      });
      component.config = { rtlEnabled: false };
      expect(component.prevClassName).toBe('dx-navigate-button dx-prev-button');
      component.props.pageIndex = 0;
      expect(component.prevClassName).toBe('dx-button-disable dx-navigate-button dx-prev-button');
    });

    it('nextClassName, rtlEnabled: false, hasKnownLastPage = false', () => {
      const component = new PageIndexSelector({
        pageIndex: 3, pageCount: 3, hasKnownLastPage: false,
      });
      component.config = { rtlEnabled: false };
      expect(component.nextClassName).toBe('dx-navigate-button dx-next-button');
      component.props.pageIndex = 4;
      expect(component.nextClassName).toBe('dx-navigate-button dx-next-button');
    });

    it('nextClassName, rtlEnabled: true', () => {
      const component = new PageIndexSelector({
        pageIndex: 1, pageCount: 5, hasKnownLastPage: true,
      });
      component.config = { rtlEnabled: true };
      expect(component.nextClassName).toBe('dx-navigate-button dx-next-button');
      component.props.pageIndex = 0;
      expect(component.nextClassName).toBe('dx-button-disable dx-navigate-button dx-next-button');
    });

    it('prevClassName, rtlEnabled: true', () => {
      const component = new PageIndexSelector({
        pageIndex: 3, pageCount: 5, hasKnownLastPage: true,
      });
      component.config = { rtlEnabled: true };
      expect(component.prevClassName).toBe('dx-navigate-button dx-prev-button');
      component.props.pageIndex = 4;
      expect(component.prevClassName).toBe('dx-button-disable dx-navigate-button dx-prev-button');
    });

    describe('navigateToNextPage', () => {
      it('rtlEnabled: false, can navigate', () => {
        const component = new PageIndexSelector({
          pageIndex: 3, pageCount: 5,
        });
        component.config = { rtlEnabled: false };
        component.navigateToNextPage();
        expect(component.props.pageIndex).toBe(4);
      });

      it('rtlEnabled: false, cannot navigate', () => {
        const component = new PageIndexSelector({
          pageIndex: 4, pageCount: 5, hasKnownLastPage: true,
        });
        component.config = { rtlEnabled: false };
        component.navigateToNextPage();
        expect(component.props.pageIndex).toBe(4);
      });

      it('rtlEnabled: true, can navigate', () => {
        const component = new PageIndexSelector({
          pageIndex: 1, pageCount: 5,
        });
        component.config = { rtlEnabled: true };
        component.navigateToNextPage();
        expect(component.props.pageIndex).toBe(0);
      });

      it('rtlEnabled: true, cannot navigate', () => {
        const component = new PageIndexSelector({
          pageIndex: 0, pageCount: 5, hasKnownLastPage: true,
        });
        component.config = { rtlEnabled: true };
        component.navigateToNextPage();
        expect(component.props.pageIndex).toBe(0);
      });
    });

    it('navigateToPrevPage, rtlEnabled: false, can navigate', () => {
      const component = new PageIndexSelector({
        pageIndex: 1, pageCount: 5, hasKnownLastPage: false,
      });
      component.config = { rtlEnabled: false };
      component.navigateToPrevPage();
      expect(component.props.pageIndex).toBe(0);
    });

    it('navigateToPrevPage, rtlEnabled: false, hasKnownLastPage: true, cannot navigate', () => {
      const component = new PageIndexSelector({
        pageIndex: 0, pageCount: 5, hasKnownLastPage: true,
      });
      component.config = { rtlEnabled: false };
      component.navigateToPrevPage();
      expect(component.props.pageIndex).toBe(0);
    });

    it('navigateToPrevPage, rtlEnabled: false, hasKnownLastPage: false, cannot navigate', () => {
      const pageIndexChange = jest.fn();
      const component = new PageIndexSelector({
        pageIndex: 0, pageCount: 5, hasKnownLastPage: false,
      });
      component.config = { rtlEnabled: false };
      expect(pageIndexChange).not.toBeCalled();
      component.navigateToPrevPage();
      expect(pageIndexChange).not.toBeCalled();
    });

    it('navigateToPrevPage, rtlEnabled: true, can navigate', () => {
      const component = new PageIndexSelector({
        pageIndex: 3, pageCount: 5, hasKnownLastPage: false,
      });
      component.config = { rtlEnabled: true };
      component.navigateToPrevPage();
      expect(component.props.pageIndex).toBe(4);
    });

    it('navigateToPrevPage, rtlEnabled: true, cannot navigate', () => {
      const component = new PageIndexSelector({
        pageIndex: 4, pageCount: 5, hasKnownLastPage: true,
      });
      component.config = { rtlEnabled: true };
      component.navigateToPrevPage();
      expect(component.props.pageIndex).toBe(4);
    });
  });
});
