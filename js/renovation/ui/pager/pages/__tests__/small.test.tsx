import React, { createRef } from 'react';
import { mount } from 'enzyme';
import { PagesSmall, viewFunction as PagesSmallComponent } from '../small';
import getElementComputedStyle from '../../utils/get_computed_style';
import { NumberBox } from '../../../number_box';

jest.mock('../../utils/get_computed_style');

describe('Small pager pages', () => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const render = (props) => {
    const tree = mount<Element>(<PagesSmallComponent {...props} /> as any).childAt(0);
    const pageIndexNumberBox = tree.childAt(0);
    const span = tree.childAt(1);
    const maxPage = tree.childAt(2);

    return {
      tree,
      pageIndexNumberBox,
      span,
      maxPage,
    };
  };

  it('View', () => {
    const pageIndexRef = createRef();
    const props = {
      valueChange: jest.fn(),
      width: 40,
      value: 3,
      pageIndexRef: pageIndexRef as unknown as NumberBox,
      selectLastPageIndex: jest.fn(),
      props: { pageCount: 100, pagesCountText: 'of', rtlEnabled: true },
    } as Partial<PagesSmall>;
    const {
      tree, pageIndexNumberBox, span, maxPage,
    } = render(props);
    expect(tree.props().className).toBe('dx-light-pages');

    expect(pageIndexNumberBox.instance()).toBe(pageIndexRef.current);
    expect(pageIndexNumberBox.props()).toMatchObject({
      className: 'dx-page-index', max: 100, min: 1, value: 3, rtlEnabled: true, valueChange: props.valueChange, width: 40,
    });
    expect(span.html()).toBe('<span class="dx-info  dx-info-text">of</span>');
    expect(maxPage.props()).toMatchObject({
      index: 99, selected: false, className: 'dx-pages-count', onClick: props.selectLastPageIndex,
    });
  });

  describe('Behaviour', () => {
    it('updateWidth effect', () => {
      (getElementComputedStyle as jest.Mock).mockReturnValue({ minWidth: '19px' });
      const component = new PagesSmall({ pageCount: 100 });
      const numberBoxElement = {};
      component.pageIndexRef = { getHtmlElement: () => numberBoxElement } as any;
      component.updateWidth();
      expect(getElementComputedStyle).toBeCalledWith(numberBoxElement);
      expect(component.width).toBe(19 + 10 * 3);
    });

    it('Effect updateWidth default width', () => {
      (getElementComputedStyle as jest.Mock).mockReturnValue(null);
      const component = new PagesSmall({ pageCount: 100 });
      const numberBoxElement = {};
      component.pageIndexRef = { getHtmlElement: () => numberBoxElement } as any;
      component.updateWidth();
      expect(component.width).toBe(10 + 10 * 3);
    });

    it('selectLastPageIndex', () => {
      const pageIndexChangeHandler = jest.fn();
      const component = new PagesSmall({
        pageCount: 3,
        pageIndex: 2,
      });
      expect(() => component.selectLastPageIndex()).not.toThrow();
      component.props.pageIndexChange = pageIndexChangeHandler;
      component.selectLastPageIndex();
      expect(pageIndexChangeHandler).toBeCalledWith(2);
    });

    it('valueChange', () => {
      const component = new PagesSmall({
        pageCount: 3,
        pageIndex: 2,

      });
      component.valueChange(1);
      expect(component.props.pageIndex).toBe(0);
    });

    it('get value', () => {
      const pageIndexChangeHandler = jest.fn();
      const component = new PagesSmall({
        pageCount: 3,
        pageIndex: 2,
        pageIndexChange: pageIndexChangeHandler,
      });
      expect(component.value).toBe(3);
    });
  });
});
