import React from 'react';
import { shallow } from 'enzyme';
import {
  DateHeaderText,
  viewFunction as TextView,
} from '../dateHeaderText';

describe('DateHeaderText', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(<TextView {...viewModel} />);

    it('should pass correct props', () => {
      const headerText = render({
        props: {
          text: 'Some text',
        },
      });

      expect(headerText.children())
        .toHaveLength(1);

      expect(headerText.text())
        .toBe('Some text');
    });

    it('should pass correct props if split text', () => {
      const textParts = ['1', '2'];
      const headerText = render({
        textParts,
        props: {
          splitText: true,
          text: 'Some text',
        },
      });

      expect(headerText.children())
        .toHaveLength(2);

      headerText.children().forEach((_, index) => {
        expect(headerText.childAt(index).hasClass('dx-scheduler-header-panel-cell-date'))
          .toBe(true);

        expect(headerText.childAt(index).text())
          .toBe(textParts[index]);
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('textParts', () => {
        [
          { text: 'AABB', expected: ['AABB'] },
          { text: 'AA BB', expected: ['AA', 'BB'] },
          { text: undefined, expected: [''] },
        ].forEach(({ text, expected }) => {
          it('should return correct text parts', () => {
            const { textParts } = new DateHeaderText({ text });

            expect(textParts)
              .toEqual(expected);
          });
        });
      });
    });
  });
});
