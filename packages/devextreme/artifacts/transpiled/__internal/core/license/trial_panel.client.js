"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isClient = exports.BASE_Z_INDEX = void 0;
exports.registerCustomComponents = registerCustomComponents;
exports.renderTrialPanel = renderTrialPanel;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/* eslint-disable max-classes-per-file */
/* eslint no-restricted-imports: ["error", { "patterns": ["*"] }] */
const BASE_Z_INDEX = exports.BASE_Z_INDEX = 1500;
const isClient = () => typeof HTMLElement !== 'undefined';
exports.isClient = isClient;
const SafeHTMLElement = isClient() ? HTMLElement
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-extraneous-class
: class {};
const DATA_PERMANENT_ATTRIBUTE = 'data-permanent';
const componentNames = {
  trigger: 'dx-license-trigger',
  panel: 'dx-license'
};
const attributeNames = {
  buyNow: 'buy-now',
  version: 'version'
};
const commonStyles = {
  opacity: '1',
  visibility: 'visible',
  'clip-path': 'none',
  filter: 'none'
};
const contentStyles = _extends({}, commonStyles, {
  width: '100%',
  height: 'auto',
  'line-height': 'normal',
  display: 'block',
  'z-index': `${BASE_Z_INDEX}`,
  position: 'static',
  transform: 'translate(0px, 0px)',
  'background-color': '#FF7200',
  border: 'none',
  margin: 'auto',
  'box-sizing': 'border-box',
  'text-align': 'center'
});
const containerStyles = _extends({}, contentStyles, {
  display: 'flex',
  'align-items': 'center',
  'flex-direction': 'row',
  position: 'relative',
  top: '0px',
  left: '0px',
  padding: '0.5rem'
});
const buttonStyles = {
  width: '1rem',
  cursor: 'pointer',
  height: '1rem'
};
const textStyles = _extends({}, commonStyles, {
  display: 'inline',
  position: 'static',
  padding: '0px',
  margin: '0px',
  color: 'white',
  'font-family': '\'Segoe UI\',\'Open Sans Condensed\',-apple-system,BlinkMacSystemFont,avenir next,avenir,helvetica neue,helvetica,Cantarell,Ubuntu,roboto,noto,arial,sans-serif',
  'font-size': '0.875rem',
  'font-wight': '600'
});
function createImportantStyles(defaultStyles, customStyles) {
  const styles = customStyles ? _extends({}, defaultStyles, customStyles) : defaultStyles;
  return Object.keys(styles).reduce((cssString, currentKey) => `${cssString}${[currentKey, `${styles[currentKey]} !important;`].join(': ')}`, '');
}
class DxLicense extends SafeHTMLElement {
  constructor() {
    var _DxLicense$customStyl, _DxLicense$customStyl2, _DxLicense$customStyl3, _DxLicense$customStyl4, _DxLicense$customStyl5;
    super();
    this._observer = null;
    this._inReassign = false;
    this._hidden = false;
    this._spanStyles = createImportantStyles(textStyles, (_DxLicense$customStyl = DxLicense.customStyles) === null || _DxLicense$customStyl === void 0 ? void 0 : _DxLicense$customStyl.textStyles);
    this._linkStyles = createImportantStyles(textStyles, (_DxLicense$customStyl2 = DxLicense.customStyles) === null || _DxLicense$customStyl2 === void 0 ? void 0 : _DxLicense$customStyl2.linkStyles);
    this._containerStyles = createImportantStyles(containerStyles, (_DxLicense$customStyl3 = DxLicense.customStyles) === null || _DxLicense$customStyl3 === void 0 ? void 0 : _DxLicense$customStyl3.containerStyles);
    this._contentStyles = createImportantStyles(contentStyles, (_DxLicense$customStyl4 = DxLicense.customStyles) === null || _DxLicense$customStyl4 === void 0 ? void 0 : _DxLicense$customStyl4.contentStyles);
    this._buttonStyles = createImportantStyles(buttonStyles, (_DxLicense$customStyl5 = DxLicense.customStyles) === null || _DxLicense$customStyl5 === void 0 ? void 0 : _DxLicense$customStyl5.contentStyles);
  }
  _createSpan(text) {
    const span = document.createElement('span');
    span.innerText = text;
    span.style.cssText = this._spanStyles;
    return span;
  }
  _createLink(text, href) {
    const link = document.createElement('a');
    link.innerText = text;
    link.style.cssText = this._linkStyles;
    link.href = href;
    link.target = '_blank';
    return link;
  }
  _createButton() {
    const button = document.createElement('div');
    button.style.cssText = this._buttonStyles;
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    polygon.setAttribute('points', '13.4 12.7 8.7 8 13.4 3.4 12.6 2.6 8 7.3 3.4 2.6 2.6 3.4 7.3 8 2.6 12.6 3.4 13.4 8 8.7 12.7 13.4 13.4 12.7');
    polygon.style.cssText = createImportantStyles({
      fill: '#fff',
      opacity: '.5',
      'stroke-width': '0px'
    });
    svg.setAttribute('id', 'Layer_1');
    svg.setAttribute('data-name', 'Layer 1');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.style.cssText = createImportantStyles({
      'vertical-align': 'baseline'
    });
    svg.appendChild(polygon);
    button.appendChild(svg);
    button.onclick = () => {
      this._hidden = true;
      this.style.cssText = createImportantStyles({
        display: 'none'
      });
    };
    return button;
  }
  _createContentContainer() {
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = this._contentStyles;
    contentContainer.append(this._createSpan('For evaluation purposes only. Redistribution not authorized. Please '), this._createLink('purchase a license', this.getAttribute(attributeNames.buyNow)), this._createSpan(` to continue use of DevExpress product libraries (v${this.getAttribute(attributeNames.version)}).`));
    return contentContainer;
  }
  _reassignComponent() {
    this.innerHTML = '';
    this.style.cssText = this._containerStyles;
    this.append(this._createContentContainer(), this._createButton());
  }
  connectedCallback() {
    this._reassignComponent();
    if (!this._observer) {
      this._observer = new MutationObserver(() => {
        if (this._hidden) {
          var _this$_observer;
          (_this$_observer = this._observer) === null || _this$_observer === void 0 || _this$_observer.disconnect();
          return;
        }
        if (this._inReassign) {
          this._inReassign = false;
        } else {
          this._inReassign = true;
          this._reassignComponent();
        }
      });
      this._observer.observe(this, {
        childList: true,
        attributes: true,
        // eslint-disable-next-line spellcheck/spell-checker
        subtree: true
      });
    }
  }
  disconnectedCallback() {
    setTimeout(() => {
      const licensePanel = document.getElementsByTagName(componentNames.panel);
      if (!licensePanel.length) {
        document.body.prepend(this);
      }
    }, 100);
  }
}
DxLicense.customStyles = undefined;
class DxLicenseTrigger extends SafeHTMLElement {
  connectedCallback() {
    this.style.cssText = createImportantStyles({
      display: 'none'
    });
    const licensePanel = document.getElementsByTagName(componentNames.panel);
    if (!licensePanel.length) {
      const license = document.createElement(componentNames.panel);
      license.setAttribute(attributeNames.version, this.getAttribute(attributeNames.version));
      license.setAttribute(attributeNames.buyNow, this.getAttribute(attributeNames.buyNow));
      license.setAttribute(DATA_PERMANENT_ATTRIBUTE, 'true');
      document.body.prepend(license);
    }
  }
}
function registerCustomComponents(customStyles) {
  if (!customElements.get(componentNames.trigger)) {
    DxLicense.customStyles = customStyles;
    customElements.define(componentNames.trigger, DxLicenseTrigger);
    customElements.define(componentNames.panel, DxLicense);
  }
}
function renderTrialPanel(buyNowUrl, version, customStyles) {
  registerCustomComponents(customStyles);
  const trialPanelTrigger = document.createElement(componentNames.trigger);
  trialPanelTrigger.setAttribute(attributeNames.buyNow, buyNowUrl);
  trialPanelTrigger.setAttribute(attributeNames.version, version);
  document.body.appendChild(trialPanelTrigger);
}