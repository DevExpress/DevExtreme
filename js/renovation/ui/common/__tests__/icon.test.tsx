import React from 'react';
import { shallow } from 'enzyme';
import { Icon } from '../icon';

describe('Icon', () => {
  describe('Props', () => {
    describe('source', () => {
      it('should draw nothing by default', () => {
        const icon = shallow(<Icon />);

        expect(icon.children()).toHaveLength(0);
      });

      it('should draw dxIcon', () => {
        const icon = shallow(<Icon source="icon_-190" />);

        expect(icon.children()).toHaveLength(1);

        expect(icon.childAt(0).is('i')).toBe(true);
        expect(icon.childAt(0).hasClass('dx-icon dx-icon-icon_-190')).toBe(true);
      });

      it('should draw fontIcon', () => {
        const icon = shallow(<Icon source="glyphicon glyphicon-icon" />);

        expect(icon.children()).toHaveLength(1);

        expect(icon.childAt(0).is('i')).toBe(true);
        expect(icon.childAt(0).hasClass('dx-icon glyphicon glyphicon-icon')).toBe(true);
      });

      it('should draw image icon', () => {
        const icon = shallow(<Icon source="localhost/JFLSKDksjdhfolHWThr30oi" />);

        expect(icon.children()).toHaveLength(1);

        expect(icon.childAt(0).is('img')).toBe(true);
        expect(icon.childAt(0).hasClass('dx-icon')).toBe(true);
        expect(icon.childAt(0).prop('src')).toEqual('localhost/JFLSKDksjdhfolHWThr30oi');
      });

      it('should draw svg icon', () => {
        const icon = shallow(<Icon source="<svg><path /></svg>" />);

        expect(icon.children()).toHaveLength(1);

        expect(icon.childAt(0).is('i')).toBe(true);
        expect(icon.childAt(0).hasClass('dx-icon dx-svg-icon')).toBe(true);
        expect(icon.childAt(0).contains('<svg><path /></svg>')).toBe(true);
      });
    });

    describe('position', () => {
      it('should not add any modificator by default', () => {
        const icon = shallow(<Icon source="icon_-190" />);

        expect(icon.childAt(0).hasClass('dx-icon-right')).toBe(false);
      });

      it('should draw icon after text with "right" modificator', () => {
        const icon = shallow(<Icon source="icon_-190" position="right" />);

        expect(icon.childAt(0).hasClass('dx-icon dx-icon-icon_-190')).toBe(true);
        expect(icon.childAt(0).hasClass('dx-icon-right')).toBe(true);
      });
    });
  });
});
