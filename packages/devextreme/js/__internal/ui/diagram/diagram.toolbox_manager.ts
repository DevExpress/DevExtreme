import messageLocalization from '@js/common/core/localization/message';
import type { Properties, ShapeCategory } from '@js/ui/diagram';

export type ToolboxGroupsUnspecified = NonNullable<NonNullable<Properties['toolbox']>['groups']>;

export type ToolboxGroupUnspecified = ToolboxGroupsUnspecified extends (infer T)[] ? T : never;

export type ToolboxGroup = ToolboxGroupUnspecified extends (infer T)
  ? T extends ShapeCategory ? never : T
  : never;

export type ToolboxGroups = ToolboxGroup[];

const DiagramToolboxManager = {
  getDefaultGroups(): ToolboxGroups {
    if (!this._groups) {
      this._groups = {
        general: {
          category: 'general',
          title: messageLocalization.format('dxDiagram-categoryGeneral'),
        },
        flowchart: {
          category: 'flowchart',
          title: messageLocalization.format('dxDiagram-categoryFlowchart'),
        },
        orgChart: {
          category: 'orgChart',
          title: messageLocalization.format('dxDiagram-categoryOrgChart'),
        },
        containers: {
          category: 'containers',
          title: messageLocalization.format('dxDiagram-categoryContainers'),
        },
        custom: {
          category: 'custom',
          title: messageLocalization.format('dxDiagram-categoryCustom'),
        },
      };
    }

    return this._groups as ToolboxGroups;
  },

  getGroups(groups: ToolboxGroupsUnspecified): ToolboxGroups {
    const defaultGroups = this.getDefaultGroups();
    if (groups) {
      return groups
        .map((g: ToolboxGroupUnspecified): ToolboxGroup => {
          if (typeof g === 'string') {
            return {
              category: g,
              title: defaultGroups[g]?.title || g,
            };
          }
          return g;
        })
        .filter((g) => g);
    }
    return [
      defaultGroups.general,
      defaultGroups.flowchart,
      defaultGroups.orgChart,
      defaultGroups.containers,
    ] as ToolboxGroups;
  },
};

export default DiagramToolboxManager;
