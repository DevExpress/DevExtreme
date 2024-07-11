"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _window = require("../../../../core/utils/window");
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _showdown = _interopRequireDefault(require("showdown"));
var _turndown = _interopRequireDefault(require("turndown"));
var _m_converterController = _interopRequireDefault(require("../m_converterController"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class MarkdownConverter {
  constructor() {
    var _this$_html2Markdown;
    const window = (0, _window.getWindow)();
    // @ts-expect-error
    const turndown = window && window.TurndownService || _turndown.default;
    // @ts-expect-error
    const showdown = window && window.showdown || _showdown.default;
    if (!turndown) {
      throw _ui.default.Error('E1041', 'Turndown');
    }
    if (!showdown) {
      throw _ui.default.Error('E1041', 'Showdown');
    }
    // eslint-disable-next-line new-cap
    this._html2Markdown = new turndown();
    if ((_this$_html2Markdown = this._html2Markdown) !== null && _this$_html2Markdown !== void 0 && _this$_html2Markdown.addRule) {
      this._html2Markdown.addRule('emptyLine', {
        filter: element => element.nodeName.toLowerCase() === 'p' && element.innerHTML === '<br>',
        replacement() {
          return '<br>';
        }
      });
      this._html2Markdown.keep(['table']);
    }
    this._markdown2Html = new showdown.Converter({
      simpleLineBreaks: true,
      strikethrough: true,
      tables: true
    });
  }
  toMarkdown(htmlMarkup) {
    return this._html2Markdown.turndown(htmlMarkup || '');
  }
  toHtml(markdownMarkup) {
    let markup = this._markdown2Html.makeHtml(markdownMarkup);
    if (markup) {
      markup = markup.replace(new RegExp('\\r?\\n', 'g'), '');
    }
    return markup;
  }
}
_m_converterController.default.addConverter('markdown', MarkdownConverter);
var _default = exports.default = MarkdownConverter;