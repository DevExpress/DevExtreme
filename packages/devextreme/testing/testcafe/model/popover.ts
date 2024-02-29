import type { WidgetName } from '../helpers/widgetTypings';
import Popup from './popup';

export default class Popover extends Popup {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxPopover'; }
}
