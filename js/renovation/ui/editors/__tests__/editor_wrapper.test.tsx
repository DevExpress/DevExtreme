import React from 'react';
import { shallow } from 'enzyme';
import LegacyCalendar from '../../../../ui/calendar';
import { viewFunction as EditorView, EditorProps, Editor } from '../editor_wrapper';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';

jest.mock('../../../../ui/calendar', () => jest.fn());

describe('Editor wrapper', () => {
  describe('View', () => {
    it('View render', () => {
      const componentProps = new EditorProps();
      const templateNames = ['itemTemplate'];
      const props = {
        componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Editor>;
      const editorProps = {
        componentType: LegacyCalendar,
        templateNames,
      };
      const tree = shallow(<EditorView
        {...props as any}
        props={editorProps}
      />);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        componentProps,
        componentType: LegacyCalendar,
        templateNames,
        'rest-attributes': 'true',
      });
    });
  });
});
