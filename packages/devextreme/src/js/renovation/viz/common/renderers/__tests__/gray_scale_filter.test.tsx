import React from 'react';
import { shallow } from 'enzyme';
import { GrayScaleFilter, GrayScaleFilterProps, viewFunction as GrayScaleFilterComponent } from '../gray_scale_filter';

describe('GrayScaleFilter', () => {
  describe('View', () => {
    it('should render correct filter', () => {
      const vm = {
        props: { id: 'DevExpress_1' } as GrayScaleFilterProps,
      };
      // eslint-disable-next-line max-len
      const filter = shallow(<GrayScaleFilterComponent {...vm as GrayScaleFilter} />);

      expect(filter.find('filter').props()).toStrictEqual({
        id: 'DevExpress_1',
        children: <feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 0.6 0" />,
      });
    });
  });
});
