import React from 'react';
import { shallow } from 'enzyme';
import { GrayScaleFilter, GrayScaleFilterProps, viewFunction as GrayScaleFilterComponent } from '../gray_scale_filter';

describe('GrayScaleFilter', () => {
  it('View', () => {
    const vm = {
      props: { id: 'DevExpress_1' } as GrayScaleFilterProps,
    };
    const filter = shallow(<GrayScaleFilterComponent {...vm as GrayScaleFilter} /> as JSX.Element);

    expect(filter.html())
      .toBe('<filter id="DevExpress_1"><feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 0.6 0"></feColorMatrix></filter>');
  });
});
