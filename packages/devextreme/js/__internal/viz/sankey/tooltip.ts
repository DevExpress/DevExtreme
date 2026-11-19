/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { extend as _extend } from '@ts/core/utils/extend';
import { isFunction } from '@ts/core/utils/type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import type { Tooltip } from '@ts/viz/core/tooltip';
import type Sankey from '@ts/viz/sankey/sankey';

const defaultCustomizeLinkTooltip = (formatter) => function (info): { html: string } {
  return { html: `<strong>${info.source} > ${info.target}</strong><br/>Weight: ${formatter(info.weight)}` };
};
const defaultCustomizeNodeTooltip = (formatter) => function (info): { html: string } {
  return { html: `<strong>${info.label}</strong><br/>Incoming weight: ${formatter(info.weightIn)}<br/>Outgoing weight: ${formatter(info.weightOut)}` };
};
const generateCustomCallback = function (customCallback, defaultCallback) {
  return function (objectInfo: ThemeValue): ThemeValue {
    let res = isFunction(customCallback) ? customCallback.call(objectInfo, objectInfo) : {};
    const hasOwnProperty = Object.prototype.hasOwnProperty.bind(res);
    if (!hasOwnProperty('html') && !hasOwnProperty('text')) {
      // @ts-expect-error a customize callback returns an object
      res = _extend(res, defaultCallback.call(objectInfo, objectInfo));
    }
    return res;
  };
};

export function setTooltipCustomOptions(sankey: typeof Sankey): void {
  sankey.prototype._setTooltipOptions = function (this: Sankey): void {
    const tooltip: InstanceType<typeof Tooltip> | null = this._tooltip;
    const options = tooltip && this._getOption('tooltip');

    let linkTemplate;
    let nodeTemplate;
    if (options.linkTooltipTemplate) {
      linkTemplate = this._getTemplate(options.linkTooltipTemplate);
    }
    if (options.nodeTooltipTemplate) {
      nodeTemplate = this._getTemplate(options.nodeTooltipTemplate);
    }

    tooltip && tooltip.update(_extend({}, options, {
      customizeTooltip(args: ThemeValue): ThemeValue {
        if (!(linkTemplate && args.type === 'link' || nodeTemplate && args.type === 'node')) {
          args.skipTemplate = true;
        }
        const formatter = (value: ThemeValue): string => tooltip.formatValue(value);
        if (args.type === 'node') {
          return generateCustomCallback(
            options.customizeNodeTooltip,
            defaultCustomizeNodeTooltip(formatter),
          )(args.info);
        } else if (args.type === 'link') {
          return generateCustomCallback(
            options.customizeLinkTooltip,
            defaultCustomizeLinkTooltip(formatter),
          )(args.info);
        }

        return {};
      },
      contentTemplate(arg: ThemeValue, div: ThemeValue): ThemeValue {
        const templateArgs = { model: arg.info, container: div };
        if (linkTemplate && arg.type === 'link') {
          return linkTemplate.render(templateArgs);
        }
        if (nodeTemplate && arg.type === 'node') {
          return nodeTemplate.render(templateArgs);
        }
      },
      enabled: options.enabled,
    }));
  };
  sankey.prototype.hideTooltip = function (this: Sankey): void {
    this._tooltip && this._tooltip.hide();
  };
}
