/* eslint-disable max-classes-per-file */
const licensePanelId = 'dx-licence-panel';
const componentNames = {
  trigger: 'dx-license-trigger',
  panel: 'dx-license',
};
const attributeNames = {
  buyNow: 'buy-now',
  version: 'version',
};
const commonStyles = {
  opacity: '1',
  visibility: 'visible',
};
const containerStyles = {
  ...commonStyles,
  width: '100%',
  height: 'auto',
  lineHeight: 'auto',
  display: 'block',
  'z-index': '2147483647',
  position: 'relative',
  top: '0px',
  left: '0px',
  transform: 'translate(0px, 0px)',
  padding: '5px',
  'background-color': 'white',
  border: '1px solid black',
  margin: 'auto',
  'box-sizing': 'border-box',
};
const commonTextStyles = {
  ...commonStyles,
  display: 'inline',
  position: 'static',
  padding: '0px',
  margin: '0px',
};
const spanTextStyles = {
  ...commonTextStyles,
  color: 'black',
};
class DxLicense extends HTMLElement {
  private _observer: MutationObserver | null = null;

  private _inReassign = false;

  private readonly _spanStyles: string;

  private readonly _linkStyles: string;

  private readonly _containerStyles: string;

  constructor() {
    super();
    this._spanStyles = this._createImportantStyles(spanTextStyles);
    this._linkStyles = this._createImportantStyles(commonTextStyles);
    this._containerStyles = this._createImportantStyles(containerStyles);
  }

  private _createImportantStyles(stylesMap: { [key: string]: string }): string {
    return Object.keys(stylesMap)
      .reduce(
        (cssString, currentKey) => `${cssString}${[currentKey, `${stylesMap[currentKey]} !important;`].join(': ')}`,
        '',
      );
  }

  private _createSpan(text: string): HTMLSpanElement {
    const span = document.createElement('span');
    span.innerText = text;
    span.style.cssText = this._spanStyles;
    return span;
  }

  private _createLink(text: string, href: string): HTMLAnchorElement {
    const link = document.createElement('a');
    link.innerText = text;
    link.style.cssText = this._linkStyles;
    link.href = href;
    link.target = '_blank';
    return link;
  }

  private _reassignComponent(): void {
    this.innerHTML = '';
    this.id = licensePanelId;
    this.style.cssText = this._containerStyles;
    this.append(
      this._createSpan('For evaluation purposes only. Redistribution not authorized. Please '),
      this._createLink('purchase a license', this.getAttribute(attributeNames.buyNow) as string),
      this._createSpan(` to continue use of DevExpress product libraries (v${this.getAttribute(attributeNames.version)}).`),
    );
  }

  public connectedCallback(): void {
    this._reassignComponent();
    if (!this._observer) {
      this._observer = new MutationObserver(() => {
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
        subtree: true,
      });
    }
  }

  public disconnectedCallback(): void {
    setTimeout(() => {
      const licensePanel = document.getElementById(licensePanelId);
      if (!licensePanel) {
        document.body.prepend(this);
      }
    }, 100);
  }
}
class DxLicenseTrigger extends HTMLElement {
  public connectedCallback(): void {
    const licensePanel = document.getElementById(licensePanelId);
    if (!licensePanel) {
      const license = document.createElement(componentNames.panel);

      license.setAttribute(
        attributeNames.version,
        this.getAttribute(attributeNames.version) as string,
      );

      license.setAttribute(
        attributeNames.buyNow,
        this.getAttribute(attributeNames.buyNow) as string,
      );

      license.id = licensePanelId;
      document.body.prepend(license);
    }
  }
}

export function registerLicenseComponent(): void {
  if (!customElements.get(componentNames.trigger)) {
    customElements.define(componentNames.trigger, DxLicenseTrigger);
    customElements.define(componentNames.panel, DxLicense);
  }
}

export const DX_LICENSE_TRIGGER_NAME = componentNames.trigger;
export const trialPanelAttributeNames = attributeNames;
