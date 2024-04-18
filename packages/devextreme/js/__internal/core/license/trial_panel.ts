/* eslint-disable max-classes-per-file */
import { format } from '../../../core/utils/string';

const DATA_PERMANENT_ATTRIBUTE = 'data-permanent';
const DEFAULT_PRE_LINK_TEXT = 'For evaluation purposes only. Redistribution not authorized. Please ';
const DEFAULT_LINK_TEXT = 'purchase a license';
const DEFAULT_POST_LINK_TEXT = ' to continue use of DevExpress product libraries (v{0}).';
const componentNames = {
  trigger: 'dx-license-trigger',
  panel: 'dx-license',
};
const attributeNames = {
  buyNow: 'buy-now',
  version: 'version',
  linkText: 'link-text',
  message: 'message',
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
  display: 'flex',
  'justify-content': 'center',
  'z-index': '2147483647',
  position: 'relative',
  top: '0px',
  left: '0px',
  transform: 'translate(0px, 0px)',
  padding: '8px',
  'background-color': '#FF7200',
  border: 'none',
  margin: 'auto',
  'box-sizing': 'border-box',
  'white-space': 'pre',
};
const textStyles = {
  ...commonStyles,
  display: 'inline',
  position: 'static',
  padding: '0px',
  margin: '0px',
  color: 'white',
  'font-family': '"Open Sans Condensed","HelveticaNeue-CondensedBold",Helvetica,"Arial Narrow",Calibri,Arial,"Lucida Grande",sans-serif',
  'font-size': '14px',
  'font-wight': '600',
};
class DxLicense extends HTMLElement {
  private _observer: MutationObserver | null = null;

  private _inReassign = false;

  private readonly _spanStyles: string;

  private readonly _linkStyles: string;

  private readonly _containerStyles: string;

  constructor() {
    super();
    this._spanStyles = this._createImportantStyles(textStyles);
    this._linkStyles = this._createImportantStyles(textStyles);
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

  private _createDefaultTextNodes(): Node[] {
    return [
      this._createSpan(DEFAULT_PRE_LINK_TEXT),
      this._createLink(DEFAULT_LINK_TEXT, this.getAttribute(attributeNames.buyNow) as string),
      this._createSpan(format(DEFAULT_POST_LINK_TEXT, this.getAttribute(attributeNames.version))),
    ];
  }

  private _createCustomTextNodes(messagePattern: string, linkText: string | null): Node[] {
    const nodes: Node[] = [];
    const [preLinkText, postLinkText] = messagePattern.split('{0}');

    if (preLinkText) {
      nodes.push(this._createSpan(preLinkText));
    }

    if (linkText) {
      nodes.push(this._createLink(linkText, this.getAttribute(attributeNames.buyNow) as string));
    }

    if (postLinkText) {
      nodes.push(this._createSpan(postLinkText));
    }

    return nodes;
  }

  private _reassignComponent(): void {
    this.innerHTML = '';
    this.style.cssText = this._containerStyles;

    const linkText = this.getAttribute(attributeNames.linkText);
    const messagePattern = this.getAttribute(attributeNames.message);
    const nodes = messagePattern
      ? this._createCustomTextNodes(messagePattern, linkText)
      : this._createDefaultTextNodes();

    this.append(...nodes);
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
      const licensePanel = document.getElementsByTagName(componentNames.panel);
      if (!licensePanel) {
        document.body.prepend(this);
      }
    }, 100);
  }
}
class DxLicenseTrigger extends HTMLElement {
  public connectedCallback(): void {
    const licensePanel = document.getElementsByTagName(componentNames.panel);
    if (!licensePanel) {
      const license = document.createElement(componentNames.panel);

      Object.values(attributeNames).forEach((attrName) => {
        const attrValue = this.getAttribute(attrName);

        if (attrValue) {
          license.setAttribute(attrName, attrValue);
        }
      });

      license.setAttribute(DATA_PERMANENT_ATTRIBUTE, 'true');

      document.body.prepend(license);
    }
  }
}

export function registerTrialPanelComponents(): void {
  if (!customElements.get(componentNames.trigger)) {
    customElements.define(componentNames.trigger, DxLicenseTrigger);
    customElements.define(componentNames.panel, DxLicense);
  }
}

export const DX_LICENSE_TRIGGER_NAME = componentNames.trigger;
export const trialPanelAttributeNames = attributeNames;
