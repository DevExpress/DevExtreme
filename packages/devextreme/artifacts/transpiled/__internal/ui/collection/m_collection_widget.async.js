"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _common = require("../../../core/utils/common");
var _deferred = require("../../../core/utils/deferred");
var _m_collection_widget = _interopRequireDefault(require("./m_collection_widget.edit"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const AsyncCollectionWidget = _m_collection_widget.default.inherit({
  _initMarkup() {
    this._deferredItems = [];
    this.callBase();
  },
  _renderItemContent(args) {
    const renderContentDeferred = (0, _deferred.Deferred)();
    const itemDeferred = (0, _deferred.Deferred)();
    const that = this;
    this._deferredItems[args.index] = itemDeferred;
    const $itemContent = this.callBase.call(that, args);
    itemDeferred.done(() => {
      renderContentDeferred.resolve($itemContent);
    });
    return renderContentDeferred.promise();
  },
  _onItemTemplateRendered(itemTemplate, renderArgs) {
    return () => {
      this._deferredItems[renderArgs.index].resolve();
    };
  },
  _postProcessRenderItems: _common.noop,
  _renderItemsAsync() {
    const d = (0, _deferred.Deferred)();
    _deferred.when.apply(this, this._deferredItems).done(() => {
      this._postProcessRenderItems();
      d.resolve();
    });
    return d.promise();
  },
  _clean() {
    this.callBase();
    this._deferredItems = [];
  }
});
var _default = exports.default = AsyncCollectionWidget;