import React from 'react';
import { mount } from 'enzyme';
import {
  Selection, viewFunction as SelectionView,
} from '../selection';
import { generateData } from '../../__tests__/test_data';
import { Plugins } from '../../../../../utils/plugin/context';

describe('Paging', () => {
  describe('View', () => {
    it('should be empty', () => {
      const tree = mount(<SelectionView />);
      expect(tree.html()).toEqual(null);
    });
  });
});
