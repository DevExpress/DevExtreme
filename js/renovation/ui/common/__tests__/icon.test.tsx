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
        const content = icon.childAt(0);

        expect(icon.children()).toHaveLength(1);
        expect(content.is('i')).toBe(true);
        expect(content.hasClass('dx-icon')).toBe(true);
        expect(content.hasClass('dx-icon-icon_-190')).toBe(true);
      });

      it('should draw fontIcon', () => {
        const icon = shallow(<Icon source="glyphicon glyphicon-icon" />);
        const content = icon.childAt(0);

        expect(icon.children()).toHaveLength(1);
        expect(content.is('i')).toBe(true);
        expect(content.hasClass('dx-icon')).toBe(true);
        expect(content.hasClass('glyphicon')).toBe(true);
        expect(content.hasClass('glyphicon-icon')).toBe(true);
      });

      it('should draw image icon', () => {
        const icon = shallow(<Icon source="localhost/JFLSKDksjdhfolHWThr30oi" />);
        const content = icon.childAt(0);

        expect(icon.children()).toHaveLength(1);
        expect(content.is('img')).toBe(true);
        expect(content.hasClass('dx-icon')).toBe(true);
        expect(content.prop('src')).toEqual('localhost/JFLSKDksjdhfolHWThr30oi');
      });

      it('should draw svg icon if svg is passed using iconTemplate', () => {
        const icon = shallow(<Icon
          iconTemplate={() => <svg><path /></svg>}
          source="<svg><path /></svg>"
        />);
        const content = icon.childAt(0);

        expect(icon.children()).toHaveLength(1);
        expect(content.is('i')).toBe(true);
        expect(content.hasClass('dx-icon')).toBe(true);
        expect(content.hasClass('dx-svg-icon')).toBe(true);

        expect(icon.render().find('svg')).toHaveLength(1);
      });

      it('should draw icon template if it is specified', () => {
        const icon = shallow(<Icon iconTemplate={() => <input />} />);
        const content = icon.childAt(0);

        expect(icon.children()).toHaveLength(1);
        expect(content.is('i')).toBe(true);
        expect(content.hasClass('dx-icon')).toBe(false);
        expect(content.hasClass('dx-svg-icon')).toBe(false);

        expect(icon.render().find('input')).toHaveLength(1);
      });
    });

    describe('position', () => {
      it('should not add any modificator by default', () => {
        const icon = shallow(<Icon source="icon_-190" />);
        const content = icon.childAt(0);

        expect(content.hasClass('dx-icon-right')).toBe(false);
      });

      it('should draw icon after text with "right" modificator', () => {
        const icon = shallow(<Icon source="icon_-190" position="right" />);
        const content = icon.childAt(0);

        expect(content.hasClass('dx-icon')).toBe(true);
        expect(content.hasClass('dx-icon-icon_-190')).toBe(true);
        expect(content.hasClass('dx-icon-right')).toBe(true);
      });
    });
  });
});
