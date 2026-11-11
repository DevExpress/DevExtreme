import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';
import { isElementInDom } from '@ts/core/utils/dom';

describe('DOM utils', () => {
  let element = document.createElement('div');

  beforeEach(() => {
    element = document.createElement('div');
  });

  describe('isElementInDom', () => {
    const createLink = (href: string): HTMLAnchorElement => {
      const link = document.createElement('a');
      link.href = href;
      return link;
    };

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should return true for an element in the document', () => {
      document.body.appendChild(element);

      expect(isElementInDom($(element))).toBe(true);
    });

    it('should return false for a detached element', () => {
      expect(isElementInDom($(element))).toBe(false);
    });

    it('should return false for no element', () => {
      expect(isElementInDom()).toBe(false);
      expect(isElementInDom($())).toBe(false);
    });

    it.each([
      'http://localhost:8080/page',
      'http://127.0.0.1/page',
      'http://example.com/page',
    ])('should return false for a detached link to %s', (href) => {
      expect(isElementInDom($(createLink(href)))).toBe(false);
    });

    it('should return false for a detached area element with a port in its URL', () => {
      const area = document.createElement('area');
      area.href = 'http://localhost:8080/page';

      expect(isElementInDom($(area))).toBe(false);
    });

    it('should return false for an element inside a detached link with a port in its URL', () => {
      const link = createLink('http://localhost:8080/page');
      link.appendChild(element);

      expect(isElementInDom($(element))).toBe(false);
    });

    it('should not take the link host for a selector', () => {
      document.body.appendChild(document.createElement('b'));

      expect(isElementInDom($(createLink('http://b/page')))).toBe(false);
    });

    it('should return true for a link in the document', () => {
      const link = createLink('http://localhost:8080/page');
      document.body.appendChild(link);

      expect(isElementInDom($(link))).toBe(true);
    });

    it('should return true for an element in a connected shadow root', () => {
      const host = document.body.appendChild(document.createElement('div'));
      host.attachShadow({ mode: 'open' }).appendChild(element);

      expect(isElementInDom($(element))).toBe(true);
    });

    it('should return false for an element in a detached shadow root', () => {
      const host = document.createElement('div');
      host.attachShadow({ mode: 'open' }).appendChild(element);

      expect(isElementInDom($(element))).toBe(false);
    });
  });
});
