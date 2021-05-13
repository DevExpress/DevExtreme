import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
import { Widget } from '../common/widget';
import { BoxProps } from './box_props';
import { combineClasses } from '../../utils/combine_classes';

const DIRECTION_MAP = { row: 'row', col: 'column' };
const JUSTIFY_CONTENT_MAP = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  'space-between': 'space-between',
  'space-around': 'space-around',
};
const ALIGN_ITEMS_MAP = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stretch: 'stretch',
};

export const viewFunction = (viewModel: Box): JSX.Element => (
  <Widget
    classes={viewModel.cssClasses}
    style={viewModel.cssStyles}
  />
);

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})

export class Box extends JSXComponent<BoxProps>() {
  // eslint-disable-next-line class-methods-use-this
  get cssClasses(): string {
    return combineClasses({ 'dx-box dx-box-flex': true });
  }

  get cssStyles(): { [key: string]: string } {
    const tryGetFromMap = (prop, map): string => ((prop in map) ? map[prop] : prop);
    return {
      direction: 'flex',
      flexDirection: DIRECTION_MAP[this.props.direction],
      justifyContent: tryGetFromMap(this.props.align, JUSTIFY_CONTENT_MAP),
      alignItems: tryGetFromMap(this.props.crossAlign, ALIGN_ITEMS_MAP),
    };
  }
}
