import { describe, expect, it } from '@jest/globals';
import type { HighlightedTextItem } from '@ts/grids/new/grid_core/search/types';

import { compareTextPart, splitHighlightedText } from './utils';

describe('Search', () => {
  describe('Text highlighting', () => {
    describe('Utils', () => {
      describe('compareTextPart', () => {
        it.each<{
          textPart: string;
          searchStr: string;
          result: boolean;
        }>([
          { textPart: 'AAA', searchStr: 'aaa', result: true },
          { textPart: 'aaa', searchStr: 'AAA', result: true },
          { textPart: 'aaa', searchStr: 'aaa', result: true },
          { textPart: 'AAA', searchStr: 'AAA', result: true },
          { textPart: 'bbb', searchStr: 'aaa', result: false },
          { textPart: 'BBB', searchStr: 'aaa', result: false },
        ])('case insensitive comparison: "$textPart" with "$searchStr" = $result', ({
          textPart,
          searchStr,
          result,
        }) => {
          const comparisonResult = compareTextPart(textPart, searchStr, false);

          expect(comparisonResult).toBe(result);
        });

        it.each<{
          textPart: string;
          searchStr: string;
          result: boolean;
        }>([
          { textPart: 'AAA', searchStr: 'aaa', result: false },
          { textPart: 'aaa', searchStr: 'AAA', result: false },
          { textPart: 'aaa', searchStr: 'aaa', result: true },
          { textPart: 'AAA', searchStr: 'AAA', result: true },
          { textPart: 'bbb', searchStr: 'aaa', result: false },
          { textPart: 'BBB', searchStr: 'aaa', result: false },
        ])('case sensitive comparison: "$textPart" with "$searchStr" = $result', ({
          textPart,
          searchStr,
          result,
        }) => {
          const comparisonResult = compareTextPart(textPart, searchStr, true);

          expect(comparisonResult).toBe(result);
        });
      });

      describe('splitHighlightedText', () => {
        it('should return null if highlighting disabled', () => {
          const result = splitHighlightedText('some text', {
            enabled: false,
            searchStr: 'some',
            caseSensitive: false,
          });

          expect(result).toBeNull();
        });

        it('should return null if search string is empty', () => {
          const result = splitHighlightedText('some text', {
            enabled: true,
            searchStr: '',
            caseSensitive: false,
          });

          expect(result).toBeNull();
        });

        it('case insensitive: should return null if search string has not any matches with text', () => {
          const result = splitHighlightedText('some text', {
            enabled: true,
            searchStr: 'AAA',
            caseSensitive: false,
          });

          expect(result).toBeNull();
        });

        it('case sensitive: should return null if search string has not any matches with text', () => {
          const result = splitHighlightedText('some text', {
            enabled: true,
            searchStr: 'SOME TEXT',
            caseSensitive: true,
          });

          expect(result).toBeNull();
        });

        it.each<{
          caseName: string;
          text: string;
          searchStr: string;
          caseSensitive: boolean;
          result: HighlightedTextItem[];
        }>([
          {
            caseName: 'case insensitive: start match',
            text: 'Some text',
            searchStr: 'some',
            caseSensitive: false,
            result: [
              { type: 'highlighted', text: 'Some' },
              { type: 'usual', text: ' text' },
            ],
          },
          {
            caseName: 'case insensitive: middle match',
            text: 'some text',
            searchStr: 'ME TE',
            caseSensitive: false,
            result: [
              { type: 'usual', text: 'so' },
              { type: 'highlighted', text: 'me te' },
              { type: 'usual', text: 'xt' },
            ],
          },
          {
            caseName: 'case insensitive: end match',
            text: 'Some TeXt',
            searchStr: 'text',
            caseSensitive: false,
            result: [
              { type: 'usual', text: 'Some ' },
              { type: 'highlighted', text: 'TeXt' },
            ],
          },
          {
            caseName: 'case insensitive: one letter match',
            text: 'some text sOme text',
            searchStr: 'o',
            caseSensitive: false,
            result: [
              { type: 'usual', text: 's' },
              { type: 'highlighted', text: 'o' },
              { type: 'usual', text: 'me text s' },
              { type: 'highlighted', text: 'O' },
              { type: 'usual', text: 'me text' },
            ],
          },
          {
            caseName: 'case insensitive: multiple match',
            text: 'some multiple text some match',
            searchStr: 'SOME',
            caseSensitive: false,
            result: [
              { type: 'highlighted', text: 'some' },
              { type: 'usual', text: ' multiple text ' },
              { type: 'highlighted', text: 'some' },
              { type: 'usual', text: ' match' },
            ],
          },
          {
            caseName: 'case insensitive: special characters match',
            text: '$@some $!@text $@var',
            searchStr: '$@',
            caseSensitive: false,
            result: [
              { type: 'highlighted', text: '$@' },
              { type: 'usual', text: 'some $!@text ' },
              { type: 'highlighted', text: '$@' },
              { type: 'usual', text: 'var' },
            ],
          },
          {
            caseName: 'case insensitive: special characters with text match',
            text: '$@some $!@text $@var',
            searchStr: '$!@text',
            caseSensitive: false,
            result: [
              { type: 'usual', text: '$@some ' },
              { type: 'highlighted', text: '$!@text' },
              { type: 'usual', text: ' $@var' },
            ],
          },
          {
            caseName: 'case sensitive: start match',
            text: 'Some text',
            searchStr: 'Some',
            caseSensitive: true,
            result: [
              { type: 'highlighted', text: 'Some' },
              { type: 'usual', text: ' text' },
            ],
          },
          {
            caseName: 'case sensitive: middle match',
            text: 'Some Text',
            searchStr: 'me Te',
            caseSensitive: true,
            result: [
              { type: 'usual', text: 'So' },
              { type: 'highlighted', text: 'me Te' },
              { type: 'usual', text: 'xt' },
            ],
          },
          {
            caseName: 'case sensitive: end match',
            text: 'Some Text',
            searchStr: 'Text',
            caseSensitive: true,
            result: [
              { type: 'usual', text: 'Some ' },
              { type: 'highlighted', text: 'Text' },
            ],
          },
          {
            caseName: 'case sensitive: one letter match',
            text: 'Some text sOme text',
            searchStr: 'o',
            caseSensitive: true,
            result: [
              { type: 'usual', text: 'S' },
              { type: 'highlighted', text: 'o' },
              { type: 'usual', text: 'me text sOme text' },
            ],
          },
          {
            caseName: 'case sensitive: multiple match',
            text: 'Some multiple text some match',
            searchStr: 'Some',
            caseSensitive: true,
            result: [
              { type: 'highlighted', text: 'Some' },
              { type: 'usual', text: ' multiple text some match' },
            ],
          },
          {
            caseName: 'case sensitive: special characters match',
            text: '$@some $!@text $@var',
            searchStr: '$@',
            caseSensitive: true,
            result: [
              { type: 'highlighted', text: '$@' },
              { type: 'usual', text: 'some $!@text ' },
              { type: 'highlighted', text: '$@' },
              { type: 'usual', text: 'var' },
            ],
          },
          {
            caseName: 'case sensitive: special characters with text match',
            text: '$@some $!@TeXt $@var $!@text',
            searchStr: '$!@TeXt',
            caseSensitive: true,
            result: [
              { type: 'usual', text: '$@some ' },
              { type: 'highlighted', text: '$!@TeXt' },
              { type: 'usual', text: ' $@var $!@text' },
            ],
          },
        ])('$caseName', ({
          text,
          searchStr,
          caseSensitive,
          result,
        }) => {
          const textParts = splitHighlightedText(
            text,
            {
              enabled: true,
              searchStr,
              caseSensitive,
            },
          );

          expect(textParts).toStrictEqual(result);
        });
      });
    });
  });
});
