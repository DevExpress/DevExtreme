import {
  ComponentBindings, JSXTemplate, OneWay, Template,
} from 'devextreme-generator/component_declaration/common';
import { GroupRenderItem, ResourceCellTemplateProps } from '../../types.d';

@ComponentBindings()
export class GroupPanelRowProps {
  @OneWay() groupItems: GroupRenderItem[] = [];

  @Template() cellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  @OneWay() className?: string = '';
}
