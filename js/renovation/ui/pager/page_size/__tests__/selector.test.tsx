/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createRef } from 'react';
import { mount } from 'enzyme';
import { RefObject } from '@devextreme-generator/declarations';
import { PageSizeSelector, viewFunction as PageSizeSelectorComponent } from '../selector';
import { PageSizeSmall } from '../small';
import { PageSizeLarge } from '../large';
import messageLocalization from '../../../../../localization/message';

jest.mock('../../../../../localization/message', () => ({
  getFormatter: jest.fn(),
}));

jest.mock('../small', () => ({ PageSizeSmall: () => null }));
jest.mock('../large', () => ({ PageSizeLarge: () => null }));

describe('Pager size selector', () => {
  function defaultProps(): PageSizeSelector {
    const htmlRef = createRef();
    return {
      htmlRef: htmlRef as RefObject<HTMLDivElement>,
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
      } as Partial<PageSizeSelector['props']>,
    } as Partial<PageSizeSelector> as PageSizeSelector;
  }

  it('View, isLargeDisplayMode = true', () => {
    const props = defaultProps();
    const tree = mount(<PageSizeSelectorComponent {...props as any} /> as any).childAt(0);
    expect(tree.props()).toMatchObject({ className: 'dx-page-sizes' });
    expect(tree.find(PageSizeLarge)).toHaveLength(1);
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
    expect(tree.find(PageSizeSmall)).toHaveLength(1);
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
      parentRef: props.htmlRef,
    });
  });

  describe('Logic', () => {
    it('normalizedPageSizes', () => {
      const component = new PageSizeSelector({ pageSizes: [5, 10], pageSizeChange: jest.fn() });
      expect(component.normalizedPageSizes).toEqual(defaultProps().normalizedPageSizes);
    });

    it('normalizedPageSizes, all', () => {
      (messageLocalization.getFormatter as jest.Mock).mockReturnValue(() => 'All');
      const component = new PageSizeSelector({ pageSizes: ['all', 0], pageSizeChange: jest.fn() });
      expect(component.normalizedPageSizes).toEqual([{ text: 'All', value: 0 }, { text: 'All', value: 0 }]);
    });

    describe('setRootElementRef', () => {
      it('set rootElementRef to div ref', () => {
        const widgetRef = { } as RefObject<HTMLDivElement>;
        const component = new PageSizeSelector({
          rootElementRef: { current: {} } as RefObject<HTMLDivElement>,
        });
        component.htmlRef = widgetRef;
        component.setRootElementRef();

        expect(component.htmlRef.current).toBe(component.props.rootElementRef?.current);
      });

      it('hasnt rootElementRef', () => {
        const component = new PageSizeSelector({ });
        component.htmlRef = {} as RefObject<HTMLDivElement>;
        component.setRootElementRef();
        expect(component.props.rootElementRef).toBeUndefined();
      });
    });
  });
});
