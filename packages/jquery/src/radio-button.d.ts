/* eslint-disable import/no-default-export, max-classes-per-file */

/**
 * @public
 * @docid
 * @wrappable
 */
export class RadioButton {}

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export default class dxRadioButton {}

/**
 * @public
 */
export type Properties<T = unknown> = {
  /**
   * @docid RadioButtonOptions.value
   * @public
   */
  value: T;
  /**
   * @docid RadioButtonOptions.name
   * @public
   */
  name?: string;
  /**
   * @docid RadioButtonOptions.checked
   * @public
   */
  checked?: boolean;
  /**
   * @docid RadioButtonOptions.defaultChecked
   * @public
   */
  defaultChecked?: boolean;
  /**
   * @docid RadioButtonOptions.label
   * @public
   */
  label?: string;
  /**
   * @docid RadioButtonOptions.radioTemplate
   * @public
   */
  radioTemplate?: () => unknown;
  /**
   * @docid RadioButtonOptions.labelTemplate
   * @public
   */
  labelTemplate?: () => unknown;
  /**
   * @docid RadioButtonOptions.onSelected
   * @public
   */
  onSelected?: () => unknown;
  /**
   * @docid RadioButtonOptions.onClick
   * @public
   */
  onClick?: () => unknown;
};
