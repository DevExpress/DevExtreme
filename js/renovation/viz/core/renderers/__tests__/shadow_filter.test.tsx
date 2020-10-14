import React from 'react';
import { shallow } from 'enzyme';
import { ShadowFilter, ShadowFilterProps, viewFunction as ShadowFilterComponent } from '../shadow_filter';

describe('ShadowFilter', () => {
  it('View', () => {
    const vm = {
      props: {
        id: 'DevExpress_1',
        x: '-50%',
        y: '-50%',
        width: '200%',
        height: '200%',
        offsetX: 6,
        offsetY: 6,
        blur: 3,
        color: '#333333',
        opacity: 0.8,
      } as ShadowFilterProps,
    };
    const filter = shallow(<ShadowFilterComponent {...vm as ShadowFilter} /> as JSX.Element);

    expect(filter.children()).toHaveLength(5);
    expect(filter.props()).toMatchObject({
      id: 'DevExpress_1',
      x: '-50%',
      y: '-50%',
      width: '200%',
      height: '200%',
    });
    expect(filter.childAt(0).props()).toMatchObject({ stdDeviation: 3 });
    expect(filter.childAt(1).props()).toMatchObject({ dx: 6, dy: 6 });
    expect(filter.childAt(2).props()).toMatchObject({ floodColor: '#333333', floodOpacity: 0.8 });
  });
});
