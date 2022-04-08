import React from 'react';
import { mount } from 'enzyme';
import {
  RowBase, viewFunction as RowBaseView, RowClassesGetter, RowPropertiesGetter,
} from '../row_base';

describe('RowBase', () => {
  describe('View', () => {
    it('default render with template', () => {
      const rowBase = new RowBase({
        children: <td>Some value</td>,
      });

      const tree = mount(<RowBaseView {...rowBase as any} />, {
        attachTo: document.createElement('tbody'),
      });
      expect(tree.find('td').text()).toEqual('Some value');
    });
  });

  describe('Effects', () => {
    describe('watchAdditionalParams', () => {
      it('should update additionalParams', () => {
        const rowBase = new RowBase({});
        rowBase.plugins.extend(RowPropertiesGetter, -1, () => () => ({
          'some-attr': 'some-value',
        }));

        rowBase.watchAdditionalParams();

        expect(rowBase.additionalParams).toEqual({
          'some-attr': 'some-value',
        });
      });
    });

    describe('watchAdditionalClasses', () => {
      it('should update additionalClasses', () => {
        const rowBase = new RowBase({});
        rowBase.plugins.extend(RowClassesGetter, -1, () => () => ({
          'some-class': true,
        }));

        rowBase.watchAdditionalClasses();

        expect(rowBase.additionalClasses).toEqual({
          'some-class': true,
        });
      });
    });
  });
});
