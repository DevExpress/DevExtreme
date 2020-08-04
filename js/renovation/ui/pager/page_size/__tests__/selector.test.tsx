/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createRef } from 'react';
import { mount } from 'enzyme';
import { PageSizeSelector, viewFunction as PageSizeSelectorComponent } from '../selector';

describe('Pager size selector', () => {
  function defaultProps(): PageSizeSelector {
    const htmlRef = createRef();
    return {
      htmlRef: htmlRef as unknown as HTMLDivElement,
      visible: true,
      normalizedPageSizes: [{
        text: '5',
        value: 5,
      },
      {
        text: '10',
        value: 10,
      },
      ],
      props: {
        isLargeDisplayMode: true,
        pageSize: 5,
        pageSizeChange: jest.fn(),
        rtlEnabled: false,
      },
    } as Partial<PageSizeSelector> as PageSizeSelector;
  }

  it('View, isLargeDisplayMode = true', () => {
    const props = defaultProps();
    const tree = mount(<PageSizeSelectorComponent {...props as any} /> as any).childAt(0);
    expect(tree.props()).toMatchObject({ className: 'dx-page-sizes' });
    expect(tree.childAt(0).props()).toMatchObject({
      pageSize: 5,
      pageSizeChange: props.props?.pageSizeChange,
      pageSizes: [
        {
          text: '5',
          value: 5,
        },
        {
          text: '10',
          value: 10,
        },
      ],
    });
  });

  it('View, isLargeDisplayMode = false', () => {
    const props = defaultProps();
    props.props.isLargeDisplayMode = false;
    const tree = mount(<PageSizeSelectorComponent {...props as any} /> as any).childAt(0);
    expect(tree.props()).toMatchObject({ className: 'dx-page-sizes' });
    expect(tree.instance()).toBe((props.htmlRef as any).current);
    expect(tree.childAt(0).props()).toMatchObject({
      pageSize: 5,
      pageSizes: [
        {
          text: '5',
          value: 5,
        },
        {
          text: '10',
          value: 10,
        },
      ],
      pageSizeChange: props.props?.pageSizeChange,
      rtlEnabled: false,
      parentRef: props.htmlRef,
    });
  });

  describe('Logic', () => {
    it('normalizedPageSizes', () => {
      const component = new PageSizeSelector({ pageSizes: [5, 10], pageSizeChange: jest.fn() });
      expect(component.normalizedPageSizes).toEqual(defaultProps().normalizedPageSizes);
    });

    it('getHtmlElement', () => {
      const htmlRef = {} as HTMLDivElement;
      const component = new PageSizeSelector({ pageSizes: [5, 10], pageSizeChange: jest.fn() });
      component.htmlRef = htmlRef;
      expect(component.getHtmlElement()).toBe(htmlRef);
    });
  });
});
