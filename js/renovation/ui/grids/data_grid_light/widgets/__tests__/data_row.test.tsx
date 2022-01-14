import React from 'react';
import { mount } from 'enzyme';
import {
  DataRow, DataRowClassesGetter, DataRowPropertiesGetter, viewFunction as DataRowView,
} from '../data_row';

describe('DataRow', () => {
  describe('View', () => {
    it('default render with template', () => {
      const dataRow = new DataRow({
        columns: [{ cellTemplate: () => <span>Some value</span> }],
      });

      const tree = mount(<DataRowView {...dataRow as any} />);
      expect(tree.find('span').text()).toEqual('Some value');
    });
  });

  describe('Effects', () => {
    describe('watchAdditionalParams', () => {
      it('should update additionalParams', () => {
        const dataRow = new DataRow({});
        dataRow.plugins.extend(DataRowPropertiesGetter, -1, () => () => ({
          'some-attr': 'some-value',
        }));

        dataRow.watchAdditionalParams();

        expect(dataRow.additionalParams).toEqual({
          'some-attr': 'some-value',
        });
      });
    });

    describe('watchAdditionalClasses', () => {
      it('should update additionalClasses', () => {
        const dataRow = new DataRow({});
        dataRow.plugins.extend(DataRowClassesGetter, -1, () => () => ({
          'some-class': true,
        }));

        dataRow.watchAdditionalClasses();

        expect(dataRow.additionalClasses).toEqual({
          'some-class': true,
        });
      });
    });
  });

  describe('Plugins', () => {

  });
});
