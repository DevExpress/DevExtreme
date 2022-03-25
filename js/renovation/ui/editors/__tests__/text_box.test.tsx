import React from 'react';
import { shallow } from 'enzyme';
import { TextBox, TextBoxProps, viewFunction as TextBoxView } from '../text_box';
import { EditorStateProps } from '../internal/editor_state_props';
import { EditorLabelProps } from '../internal/editor_label_props';
import { TextEditorProps } from '../internal/text_editor_props';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacyTextBox from '../../../../ui/text_box';

jest.mock('../../../../ui/text_box', () => jest.fn());

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
});
