import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import { getSvgElement, getSvgMarkup, HIDDEN_FOR_EXPORT } from '@ts/core/utils/m_svg';

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';
const NBSP = String.fromCharCode(160);
const SOFT_HYPHEN = String.fromCharCode(173);

const createSvg = (text = ''): SVGElement => {
  const svg = document.createElementNS(SVG_NS, 'svg');
  const group = document.createElementNS(SVG_NS, 'g');

  group.textContent = text;
  svg.appendChild(group);

  return svg;
};

describe('SVG utils', () => {
  const originalSerializer = Object.getOwnPropertyDescriptor(window, 'XMLSerializer');

  const stubSerializer = (markup: string): void => {
    Object.defineProperty(window, 'XMLSerializer', {
      configurable: true,
      value: jest.fn(() => ({ serializeToString: (): string => markup })),
    });
  };

  afterEach(() => {
    if (originalSerializer) {
      Object.defineProperty(window, 'XMLSerializer', originalSerializer);
    } else {
      // @ts-expect-error the test removes the stub it has defined
      delete window.XMLSerializer;
    }
  });

  describe('getSvgMarkup', () => {
    it('should serialize an element and declare the xlink namespace', () => {
      expect(getSvgMarkup(createSvg('a'))).toBe(
        `<svg xmlns:xlink="${XLINK_NS}" xmlns="${SVG_NS}"><g>a</g></svg>`,
      );
    });

    it('should not declare the xlink namespace twice', () => {
      const svg = createSvg();
      svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', XLINK_NS);

      expect(getSvgMarkup(svg).match(/xmlns:xlink=/g)).toHaveLength(1);
    });

    it('should paint the background of a copy of the element', () => {
      const svg = createSvg();

      expect(getSvgMarkup(svg, 'red')).toMatch(/style="background-color:\s*red;?"/);
      expect(svg.getAttribute('style')).toBeNull();
    });

    it('should not add a style without a background color', () => {
      expect(getSvgMarkup(createSvg())).not.toContain('style=');
    });

    it('should replace the markup-sensitive characters with numeric references', () => {
      const svg = createSvg('a < b & c > d');
      svg.firstElementChild?.setAttribute('title', 'say "hi"');

      const markup = getSvgMarkup(svg);

      expect(markup).toContain('title="say &#34;hi&#34;"');
      expect(markup).toContain('>a &#60; b &#38; c &#62; d<');
    });

    it('should replace the no-break space and the soft hyphen with numeric references', () => {
      expect(getSvgMarkup(createSvg(`a${NBSP}b${SOFT_HYPHEN}c`))).toContain('>a&#160;b&#173;c<');
    });

    it('should decode the named entities of a serializer in any letter case', () => {
      stubSerializer(`<svg><text>&quot;&AMP;&apos;&lt;&gt;&nbsp;&shy;${NBSP}${SOFT_HYPHEN}</text></svg>`);

      expect(getSvgMarkup(createSvg())).toBe(
        `<svg xmlns:xlink="${XLINK_NS}"><text>&#34;&#38;&#39;&#60;&#62;&#160;&#173;&#160;&#173;</text></svg>`,
      );
    });

    it('should clean up the namespace artifacts of a legacy serializer', () => {
      stubSerializer(`<svg xmlns:NS1="ns" NS1:xmlns:xlink="${XLINK_NS}"/>`);

      const markup = getSvgMarkup(createSvg());

      expect(markup).not.toContain('NS1');
      expect(markup.match(/xmlns:xlink="/g)).toHaveLength(1);
      expect(markup).toContain(`xmlns:xlink="${XLINK_NS}"`);
    });
  });

  describe('getSvgElement', () => {
    const getAnyElement = getSvgElement as (markup: unknown) => unknown;

    it('should parse a markup string', () => {
      const element = getSvgElement(`<svg xmlns="${SVG_NS}"><g/></svg>`) as Element;

      expect(element.nodeName).toBe('svg');
      expect(element.firstElementChild?.nodeName).toBe('g');
    });

    it('should return a node as is', () => {
      const svg = createSvg();

      expect(getSvgElement(svg)).toBe(svg);
    });

    it('should return the first element of a renderer', () => {
      const svg = createSvg();

      expect(getSvgElement($(svg))).toBe(svg);
    });

    it('should return undefined for anything else', () => {
      expect(getAnyElement(5)).toBeUndefined();
      expect(getAnyElement(null)).toBeUndefined();
      expect(getAnyElement(undefined)).toBeUndefined();
    });
  });

  it('should export the class name of an element hidden for export', () => {
    expect(HIDDEN_FOR_EXPORT).toBe('hidden-for-export');
  });
});
