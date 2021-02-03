import * as React from 'react';
import { ElementType, IOptionElement } from '../element';
import { processChildren } from '../tree';

function createElementWithChildren(children: Array<any>):IOptionElement {
  return {
    type: ElementType.Option,
    descriptor: {
      isCollection: false,
      name: '',
      templates: [
        {
          tmplOption: 'template',
          component: 'component',
          render: 'render',
          keyFn: 'keyFn',
        },
      ],
      initialValuesProps: {},
      predefinedValuesProps: {},
      expectedChildren: {},
    },
    props: {
      children,
    },
  };
}

describe('processChildren', () => {
  describe('test transcluded content handling', () => {
    it('process empty', () => {
      const childrenData = processChildren(createElementWithChildren([]), '');
      expect(childrenData.hasTranscludedContent).toEqual(false);
    });
    it('process fragmented null', () => {
      const childrenData = processChildren(createElementWithChildren([
        <>{null}</>,
      ]), '');
      expect(childrenData.hasTranscludedContent).toEqual(true);
    });
    it('process unintended content', () => {
      const childrenData = processChildren(createElementWithChildren([
        null, undefined, false,
      ]), '');
      expect(childrenData.hasTranscludedContent).toEqual(false);
    });
    it('process string and number', () => {
      const childrenData = processChildren(createElementWithChildren([
        42, 'string',
      ]), '');
      expect(childrenData.hasTranscludedContent).toEqual(true);
    });
    it('process user template', () => {
      const UserTemplate = () => <div> User Template</div>;
      const childrenData = processChildren(createElementWithChildren([
        <UserTemplate />,
      ]), '');
      expect(childrenData.hasTranscludedContent).toEqual(true);
    });
  });
});
