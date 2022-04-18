import React from 'react';
import { shallow } from 'enzyme';
import { TextBox, TextBoxProps, viewFunction as TextBoxView } from '../text_box';
import { EditorStateProps } from '../common/editor_state_props';
import { EditorLabelProps } from '../common/editor_label_props';
import { TextEditorProps } from '../common/text_editor_props';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacyTextBox from '../../../../ui/text_box';
import { current } from '../../../../ui/themes';

jest.mock('../../../../ui/text_box', () => jest.fn());

jest.mock('../../../../ui/themes', () => ({
  ...jest.requireActual('../../../../ui/themes'),
  current: jest.fn(() => 'generic'),
}));

describe('TextBox', () => {
  it('default render', () => {
    const componentProps = {
      ...new TextBoxProps(),
      ...new EditorStateProps(),
      ...new EditorLabelProps(),
      ...new TextEditorProps(),
    };
    const props = {
      componentProps,
      restAttributes: { 'rest-attributes': 'true' },
    } as Partial<TextBox>;
    const tree = shallow(<TextBoxView {...props as any} /> as any);

    expect(tree.find(DomComponentWrapper).props()).toMatchObject({
      componentProps,
      componentType: LegacyTextBox,
      'rest-attributes': 'true',
    });
  });

  it('default values for Material theme"', () => {
    (current as jest.Mock).mockImplementation(() => 'material');

    try {
      const componentProps = {
        ...new TextBoxProps(),
        ...new EditorLabelProps(),
        ...new TextEditorProps(),
      };
      const props = {
        componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<TextBox>;
      const tree = shallow(<TextBoxView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props().componentProps).toMatchObject({
        labelMode: 'floating',
        stylingMode: 'filled',
      });
    } finally {
      jest.resetAllMocks();
    }
  });
});
