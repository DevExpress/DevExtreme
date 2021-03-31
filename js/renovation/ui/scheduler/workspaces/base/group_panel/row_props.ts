import {
  ComponentBindings, JSXTemplate, OneWay, Template,
} from '@devextreme-generator/declarations';
import { GroupRenderItem, ResourceCellTemplateProps } from '../../types.d';

@ComponentBindings()
export class GroupPanelRowProps {
  @OneWay() groupItems: GroupRenderItem[] = [];

  @Template() cellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  @OneWay() className?: string = '';
}
