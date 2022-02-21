import React from 'react';
import { mount } from 'enzyme';
import { TemplateSetter, viewFunction as TemplateSetterView } from '../template_setter';
import { createValue, Plugins } from '../context';

describe('ValueSetter', () => {
  const SomeValue = createValue();

  describe('View', () => {
    it('should be empty', () => {
      const templateSetter = new TemplateSetter({
        type: SomeValue,
        template: (): JSX.Element => <span />,
      });

      const tree = mount(<TemplateSetterView {...templateSetter as any} />);
      expect(tree.html()).toEqual('<div></div>');
    });
  });

  describe('Effects', () => {
    describe('updateTemplate', () => {
      it('should set template to plugin', () => {
        const template = (): JSX.Element => <span />;
        const valueSetter = new TemplateSetter({
          type: SomeValue,
          template,
        });
        valueSetter.plugins = new Plugins();

        valueSetter.updateTemplate();

        expect(valueSetter.plugins.getValue(SomeValue)).toEqual(template);
      });
    });
  });
});
