/* eslint-disable func-names */
import { strategyChanging } from '@ts/core/m_element_data';
import { compare as compareVersion } from '@ts/core/utils/m_version';
// eslint-disable-next-line import/no-extraneous-dependencies
import ko from 'knockout';

if (ko) {
  const patchCleanData = function (jQuery): void {
    const cleanKoData = function (element, andSelf): void {
      const cleanNode = function (): void {
        ko.cleanNode(this);
      };

      if (andSelf) {
        element.each(cleanNode);
      } else {
        element.find('*').each(cleanNode);
      }
    };

    const originalEmpty = jQuery.fn.empty;
    jQuery.fn.empty = function (...args): void {
      cleanKoData(this, false);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return originalEmpty.apply(this, args);
    };

    const originalRemove = jQuery.fn.remove;
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    jQuery.fn.remove = function (selector, keepData) {
      if (!keepData) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let subject = this;
        if (selector) {
          subject = subject.filter(selector);
        }
        cleanKoData(subject, true);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return originalRemove.call(this, selector, keepData);
    };

    const originalHtml = jQuery.fn.html;
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    jQuery.fn.html = function (value) {
      if (typeof value === 'string') {
        cleanKoData(this, false);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,prefer-rest-params
      return originalHtml.apply(this, arguments);
    };

    const originalReplaceWith = jQuery.fn.replaceWith;
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    jQuery.fn.replaceWith = function (...args) {
      const result = originalReplaceWith.apply(this, args);

      if (!this.parent().length) {
        cleanKoData(this, true);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    };
  };

  strategyChanging.add((strategy): void => {
    const isJQuery = !!strategy.fn;

    if (isJQuery && compareVersion(strategy.fn.jquery, [2, 0]) < 0) {
      patchCleanData(strategy);
    }
  });
}
