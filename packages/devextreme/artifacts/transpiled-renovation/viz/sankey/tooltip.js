"use strict";

exports.setTooltipCustomOptions = setTooltipCustomOptions;
var _extend2 = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
const defaultCustomizeLinkTooltip = formatter => function (info) {
  return {
    html: `<strong>${info.source} > ${info.target}</strong><br/>Weight: ${formatter(info.weight)}`
  };
};
const defaultCustomizeNodeTooltip = formatter => function (info) {
  return {
    html: `<strong>${info.label}</strong><br/>Incoming weight: ${formatter(info.weightIn)}<br/>Outgoing weight: ${formatter(info.weightOut)}`
  };
};
const generateCustomCallback = function (customCallback, defaultCallback) {
  return function (objectInfo) {
    let res = (0, _type.isFunction)(customCallback) ? customCallback.call(objectInfo, objectInfo) : {};
    const hasOwnProperty = Object.prototype.hasOwnProperty.bind(res);
    if (!hasOwnProperty('html') && !hasOwnProperty('text')) {
      res = (0, _extend2.extend)(res, defaultCallback.call(objectInfo, objectInfo));
    }
    return res;
  };
};
function setTooltipCustomOptions(sankey) {
  sankey.prototype._setTooltipOptions = function () {
    const tooltip = this._tooltip;
    const options = tooltip && this._getOption('tooltip');
    let linkTemplate;
    let nodeTemplate;
    if (options.linkTooltipTemplate) {
      linkTemplate = this._getTemplate(options.linkTooltipTemplate);
    }
    if (options.nodeTooltipTemplate) {
      nodeTemplate = this._getTemplate(options.nodeTooltipTemplate);
    }
    tooltip && tooltip.update((0, _extend2.extend)({}, options, {
      customizeTooltip: function (args) {
        if (!(linkTemplate && args.type === 'link' || nodeTemplate && args.type === 'node')) {
          args.skipTemplate = true;
        }
        const formatter = value => tooltip.formatValue(value);
        if (args.type === 'node') {
          return generateCustomCallback(options.customizeNodeTooltip, defaultCustomizeNodeTooltip(formatter))(args.info);
        } else if (args.type === 'link') {
          return generateCustomCallback(options.customizeLinkTooltip, defaultCustomizeLinkTooltip(formatter))(args.info);
        }
        return {};
      },
      contentTemplate(arg, div) {
        const templateArgs = {
          model: arg.info,
          container: div
        };
        if (linkTemplate && arg.type === 'link') {
          return linkTemplate.render(templateArgs);
        }
        if (nodeTemplate && arg.type === 'node') {
          return nodeTemplate.render(templateArgs);
        }
      },
      enabled: options.enabled
    }));
  };
  sankey.prototype.hideTooltip = function () {
    this._tooltip && this._tooltip.hide();
  };
}