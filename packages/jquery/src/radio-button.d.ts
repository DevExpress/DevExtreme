/**
 * @public
 * @docid
 * @wrappable
 */
export default class RadioButton {
};

/**
 * @public
 */
export type Properties<T = any> = {
  value: T;
  /**
   * @docid RadioButtonOptions.name
   * @public
   * @type any
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
  radioTemplate?: Function;
  /**
   * @docid RadioButtonOptions.labelTemplate
   * @public
   */
  labelTemplate?: Function;
  /**
   * @docid RadioButtonOptions.onSelected
   * @public
   */
  onSelected?: Function;
  /**
   * @docid RadioButtonOptions.onClick
   * @public
   */
  onClick?: Function;
}
