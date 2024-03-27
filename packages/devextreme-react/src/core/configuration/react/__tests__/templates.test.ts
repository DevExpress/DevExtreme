import { ITemplateMeta, ITemplateProps } from '../../../template';

import { getAnonymousTemplate, getNamedTemplate } from '../templates';

const children = 'some text';
const render = () => null;
const component = () => null;

const positiveCasesForAnonymous = [
  {
    props: { children },
    templateMeta: { tmplOption: 'template' },
    hasTranscludedContent: true,
    expected: {
      optionName: 'template',
      type: 'children',
      isAnonymous: true,
      content: children,
    },
  },
  {
    props: { children },
    templateMeta: { tmplOption: 'template' },
    hasTranscludedContent: true,
    expected: {
      optionName: 'template',
      type: 'children',
      isAnonymous: true,
      content: children,
    },
  },
  {
    props: { renderItem: render },
    templateMeta: { tmplOption: 'itemTemplate', render: 'renderItem' },
    hasTranscludedContent: false,
    expected: {
      optionName: 'itemTemplate',
      type: 'render',
      isAnonymous: true,
      content: render,
    },
  },
  {
    props: { renderItem: render },
    templateMeta: { tmplOption: 'template', render: 'renderItem' },
    hasTranscludedContent: false,
    expected: {
      optionName: 'template',
      type: 'render',
      isAnonymous: true,
      content: render,
    },
  },
  {
    props: { itemComponent: component },
    templateMeta: { tmplOption: 'template', component: 'itemComponent' },
    hasTranscludedContent: false,
    expected: {
      optionName: 'template',
      type: 'component',
      isAnonymous: true,
      content: component,
    },
  },
  {
    props: { itemComponent: component },
    templateMeta: { tmplOption: 'template', component: 'itemComponent' },
    hasTranscludedContent: false,
    expected: {
      optionName: 'template',
      type: 'component',
      isAnonymous: true,
      content: component,
    },
  },
];

const negativeCasesForAnonymous = [
  {
    props: { children },
    templateMeta: { tmplOption: 'template' },
    hasTranscludedContent: false,
  },
  {
    props: { renderItem: render },
    templateMeta: { tmplOption: 'template' },
    hasTranscludedContent: false,
  },
  {
    props: { renderItem: render },
    templateMeta: { tmplOption: 'template', component: 'itemComponent' },
    hasTranscludedContent: false,
  },
  {
    props: { itemComponent: component },
    templateMeta: { tmplOption: 'template', render: 'renderItem' },
    hasTranscludedContent: false,
  },
];

describe('getAnonymousTemplate', () => {
  positiveCasesForAnonymous.forEach(
    (testCase) => {
      it('returns template', () => {
        const template = getAnonymousTemplate(
          testCase.props,
          testCase.templateMeta as any as ITemplateMeta,
          testCase.hasTranscludedContent,
        );

        if (template === null) {
          expect(template).not.toBe(null);
          return;
        }

        expect(template.optionName).toBe(testCase.expected.optionName);
        expect(template.type).toBe(testCase.expected.type);
        expect(template.isAnonymous).toBe(testCase.expected.isAnonymous);
        expect(template.content).toBe(testCase.expected.content);
      });
    },
  );

  negativeCasesForAnonymous.forEach(
    (testCase) => {
      it('returns null', () => {
        const template = getAnonymousTemplate(
          testCase.props,
          testCase.templateMeta as any as ITemplateMeta,
          testCase.hasTranscludedContent,
        );

        expect(template).toBe(null);
      });
    },
  );
});

const casesForNamed = [
  {
    props: {
      name: 'template1',
      component,
    },
    expected: {
      optionName: 'template1',
      type: 'component',
      isAnonymous: false,
      content: component,
    },
  },
  {
    props: {
      name: 'template2',
      component,
    },
    expected: {
      optionName: 'template2',
      type: 'component',
      isAnonymous: false,
      content: component,
    },
  },
  {
    props: {
      name: 'template3',
      render,
    },
    expected: {
      optionName: 'template3',
      type: 'render',
      isAnonymous: false,
      content: render,
    },
  },
  {
    props: {
      name: 'template4',
      render,
    },
    expected: {
      optionName: 'template4',
      type: 'render',
      isAnonymous: false,
      content: render,
    },
  },
  {
    props: {
      name: 'template5',
      children,
    },
    expected: {
      optionName: 'template5',
      type: 'children',
      isAnonymous: false,
      content: children,
    },
  },
  {
    props: {
      name: 'template6',
      children,
    },
    expected: {
      optionName: 'template6',
      type: 'children',
      isAnonymous: false,
      content: children,
    },
  },
  {
    props: {
      name: 'template7',
    },
    expected: {
      optionName: 'template7',
      type: 'children',
      isAnonymous: false,
      content: undefined,
    },
  },
];

describe('getNamedTemplate', () => {
  casesForNamed.forEach(
    (testCase) => {
      it('returns template', () => {
        const template = getNamedTemplate(testCase.props as ITemplateProps);

        if (template === null) {
          expect(template).not.toBe(null);
          return;
        }

        expect(template.optionName).toBe(testCase.expected.optionName);
        expect(template.type).toBe(testCase.expected.type);
        expect(template.isAnonymous).toBe(testCase.expected.isAnonymous);
        expect(template.content).toBe(testCase.expected.content);
      });
    },
  );

  it('returns null', () => {
    const template = getNamedTemplate({} as ITemplateProps);

    expect(template).toBe(null);
  });
});
