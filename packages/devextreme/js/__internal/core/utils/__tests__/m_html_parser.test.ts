import { describe, expect, it } from '@jest/globals';
import { isTablePart, parseHTML } from '@ts/core/utils/m_html_parser';

const tableParts: [string, string][] = [
  ['tr', '<tr><td>1</td></tr>'],
  ['td', '<td>1</td>'],
  ['th', '<th>1</th>'],
  ['thead', '<thead><tr><th>1</th></tr></thead>'],
  ['tbody', '<tbody><tr><td>1</td></tr></tbody>'],
  ['tfoot', '<tfoot><tr><td>1</td></tr></tfoot>'],
  ['caption', '<caption>1</caption>'],
  ['colgroup', '<colgroup><col></colgroup>'],
  ['col', '<col>'],
];

describe('HTML parser utils', () => {
  describe('parseHTML', () => {
    it('should return null when the markup is not a string', () => {
      expect(parseHTML(5)).toBeNull();
      expect(parseHTML(null)).toBeNull();
      expect(parseHTML(undefined)).toBeNull();
      expect(parseHTML({})).toBeNull();
    });

    it('should parse several root elements', () => {
      const nodes = parseHTML('<div>a</div><span>b</span>') as Element[];

      expect(nodes.map((node) => node.outerHTML)).toEqual(['<div>a</div>', '<span>b</span>']);
    });

    it('should return a text node for a markup without tags', () => {
      const nodes = parseHTML('text') as ChildNode[];

      expect(nodes).toHaveLength(1);
      expect(nodes[0].nodeType).toBe(Node.TEXT_NODE);
      expect(nodes[0].textContent).toBe('text');
    });

    it('should return an empty list for an empty string', () => {
      expect(parseHTML('')).toEqual([]);
    });

    tableParts.forEach(([tag, html]) => {
      it(`should keep a root <${tag}> element`, () => {
        const nodes = parseHTML(html) as Element[];

        expect(nodes).toHaveLength(1);
        expect(nodes[0].tagName.toLowerCase()).toBe(tag);
        expect(nodes[0].outerHTML).toBe(html);
      });
    });

    it('should keep the neighbours of a table part', () => {
      const nodes = parseHTML('<td>1</td><td>2</td>') as Element[];

      expect(nodes.map((node) => node.outerHTML)).toEqual(['<td>1</td>', '<td>2</td>']);
    });
  });

  describe('isTablePart', () => {
    tableParts.forEach(([tag, html]) => {
      it(`should recognize <${tag}>`, () => {
        expect(isTablePart(html)).toBe(true);
      });
    });

    it('should not recognize other tags', () => {
      expect(isTablePart('<div></div>')).toBe(false);
      expect(isTablePart('<span>a</span>')).toBe(false);
    });

    it('should be falsy for a markup without tags', () => {
      expect(isTablePart('text')).toBeFalsy();
      expect(isTablePart('')).toBeFalsy();
    });
  });
});
