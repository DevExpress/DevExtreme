/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, createRef } from 'preact';
import { mount } from 'enzyme';
import PageSizeSelector, { viewFunction as PageSizeSelectorComponent } from '../../../js/renovation/pager/page-size-selector';

jest.mock('../../../js/renovation/pager/page-size-small', jest.fn());
jest.mock('../../../js/renovation/pager/page-size-large', jest.fn());

describe('Pager size selector', () => {
  const htmlRef = createRef();
  const defaultProps = {
    htmlRef: htmlRef as HTMLDivElement,
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
      isLargeDisplayMode: true, pageSize: 5, pageSizeChange: jest.fn(), rtlEnabled: false,
    },
  } as Partial<PageSizeSelector>;
  it('View, isLargeDisplayMode = true', () => {
    const tree = mount(<PageSizeSelectorComponent {...defaultProps as any} /> as any).childAt(0);
    expect(tree.props()).toEqual({ className: 'dx-page-sizes' });
    expect(tree.instance()).toBe(htmlRef.current);

    expect(tree.childAt(0).props()).toEqual({
      pageSize: 5,
      pageSizeChange: defaultProps.props?.pageSizeChange,
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
    const props = { ...defaultProps, props: { ...defaultProps.props, isLargeDisplayMode: false } };
    const tree = mount(<PageSizeSelectorComponent {...props as any} /> as any).childAt(0);
    expect(tree.props()).toEqual({ className: 'dx-page-sizes' });
    expect(tree.instance()).toBe(htmlRef.current);
    expect(tree.childAt(0).props()).toEqual({
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
      pageSizeChange: defaultProps.props?.pageSizeChange,
      rtlEnabled: false,
      parentRef: htmlRef,
    });
  });
  describe('Logic', () => {
    it('normalizedPageSizes', () => {
      const component = new PageSizeSelector({ pageSizes: [5, 10], pageSizeChange: jest.fn() });
      expect(component.normalizedPageSizes).toEqual(defaultProps.normalizedPageSizes);
    });
  });
});
