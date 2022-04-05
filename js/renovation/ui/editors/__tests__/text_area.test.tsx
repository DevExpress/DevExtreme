import React from 'react';
import { shallow } from 'enzyme';
import { TextArea, TextAreaProps, viewFunction as TextAreaView } from '../text_area';
import { EditorStateProps } from '../common/editor_state_props';
import { EditorLabelProps } from '../common/editor_label_props';
import { TextEditorProps } from '../common/text_editor_props';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacyTextArea from '../../../../ui/text_area';

jest.mock('../../../../ui/text_area', () => jest.fn());

describe('TextArea', () => {
  it('default render', () => {
    const componentProps = {
      ...new TextAreaProps(),
      ...new EditorStateProps(),
      ...new EditorLabelProps(),
      ...new TextEditorProps(),
    };
    const props = {
      componentProps,
      restAttributes: { 'rest-attributes': 'true' },
    } as Partial<TextArea>;
    const tree = shallow(<TextAreaView {...props as any} /> as any);

    expect(tree.find(DomComponentWrapper).props()).toMatchObject({
      componentProps,
      componentType: LegacyTextArea,
      'rest-attributes': 'true',
    });
  });
});
