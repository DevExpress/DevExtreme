import {
  ComponentBindings, JSXTemplate, OneWay, Template,
} from '@devextreme-generator/declarations';
import { ResourceCellTemplateProps } from '../../types';
import { GroupRenderItem } from '../../../../../../__internal/scheduler/__migration/types';

@ComponentBindings()
export class GroupPanelRowProps {
  @OneWay() groupItems: GroupRenderItem[] = [];

  @Template() cellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  @OneWay() className?: string = '';
}
