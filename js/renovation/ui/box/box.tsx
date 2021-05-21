import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
import { Widget } from '../common/widget';
import { BoxProps } from './box_props';
import { combineClasses } from '../../utils/combine_classes';

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
    const DIRECTION_MAP = { row: 'row', col: 'column' };
    const tryGetFromMap = (prop, map): string => ((prop in map) ? map[prop] : prop);
    return {
      display: 'flex',
      flexDirection: DIRECTION_MAP[this.props.direction],
      justifyContent: tryGetFromMap(this.props.align, {
        start: 'flex-start',
        end: 'flex-end',
        center: 'center',
        'space-between': 'space-between',
        'space-around': 'space-around',
      }),
      alignItems: tryGetFromMap(this.props.crossAlign, {
        start: 'flex-start',
        end: 'flex-end',
        center: 'center',
        stretch: 'stretch',
      }),
    };
  }
}
