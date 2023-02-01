import { DEFAULT_DOM_OPTIONS, DOM_ATTRIBUTES, DOM_CSS_CLASSES } from './consts';
import { DomOptions, PropBuilders } from './types';
import { buildAttributes, buildCss, createBuilder } from './utils';

export const PROP_BUILDERS: PropBuilders = {
  accessKey: createBuilder(
    DEFAULT_DOM_OPTIONS.accessKey,
    (
      { shortcutKey }: DomOptions['accessKey'],
    ) => buildAttributes(!!shortcutKey, { [DOM_ATTRIBUTES.accessKey]: shortcutKey }),
  ),
  active: createBuilder(
    DEFAULT_DOM_OPTIONS.active,
    (
      { activeStateEnabled }: DomOptions['active'],
    ) => buildCss(activeStateEnabled, DOM_CSS_CLASSES.active),
  ),
  attributes: createBuilder(
    DEFAULT_DOM_OPTIONS.attributes,
    (
      { attributes }: DomOptions['attributes'],
    ) => buildAttributes(true, attributes),
  ),
  disabled: createBuilder(
    DEFAULT_DOM_OPTIONS.disabled,
    (
      { disabled }: DomOptions['disabled'],
    ) => buildAttributes(disabled, {
      [DOM_ATTRIBUTES.disabled]: ' ',
      [DOM_ATTRIBUTES.tabIndex]: undefined,
    }),
  ),
  focus: createBuilder(
    DEFAULT_DOM_OPTIONS.focus,
    ({ focusStateEnabled, tabIndex }) => (props) => {
      const result = buildCss(focusStateEnabled, DOM_CSS_CLASSES.focus)(props);
      return buildAttributes(
        true,
        {
          [DOM_ATTRIBUTES.tabIndex]: props.attributes[DOM_ATTRIBUTES.disabled]
            ? undefined
            : tabIndex,
        },
      )(result);
    },
  ),
  hint: createBuilder(
    DEFAULT_DOM_OPTIONS.hint,
    ({ hint }) => buildAttributes(!!hint, {
      [DOM_ATTRIBUTES.title]: hint!,
    }),
  ),
  hover: createBuilder(
    DEFAULT_DOM_OPTIONS.hover,
    ({ hoverStateEnabled }) => buildCss(hoverStateEnabled, DOM_CSS_CLASSES.hover),
  ),
};
