import { AspNet, Mutation } from 'devextreme-internal-tools/metadata';
import { addMember, cleanArtifacts, removeMembers, types } from './common';
import { commonSmdCollectionItems } from './common/smd';
import { enums, enumAliases, enumItemRenamings } from './aspnet/enums'
import { PATHS } from './common/paths';

cleanArtifacts('StrongMetaData.json', 'StrongMetaDataGenerator.cfg.json');

AspNet.makeMetadata({
  args: {
    version: '25_1',
    artifacts: PATHS.artifactsDir,
  },
  mutations: [
    removeMembers(/\/ai-integration:AIIntegration/),
    removeMembers(/\/html_editor:AICommand/),
    ...replaceWithWidgetFactory({
      uid: 'ui/form:dxFormSimpleItem',
      from: {
        componentNameProp: 'editorType',
        componentConfigProp: 'editorOptions',
      },
      to: {
        factoryName: 'FormItemEditor',
        newProp: 'editor',
      },
    }),
    ...replaceWithWidgetFactory({
      uid: 'ui/toolbar:dxToolbarItem',
      from: {
        componentNameProp: 'widget',
        componentConfigProp: 'options',
      },
      to: {
        factoryName: 'ToolbarItem',
        newProp: 'widget',
      },
    }),
    addMember({
      uid: 'ui/popover:ToolbarItem',
      name: 'dxPopoverToolbarItem',
      parent: 'ui/popup:ToolbarItem',
    }),
    addMember({
      uid: 'ui/popover:dxPopoverOptions.toolbarItems',
      types: [types.array(types.memberRef('ui/popover:ToolbarItem'))],
    }),
    removeMembers(/ui\/scheduler:ToolbarItem\.options/),
  ],
  variables: {
    forwardedEnums: [
      {
        uid: 'ui/form:FormItemComponent',
        name: 'FormItemEditorType',
      },
      {
        uid: 'common:ToolbarItemComponent',
        name: 'ToolbarItemWidget',
      },
    ],
    collectionItems: [...commonSmdCollectionItems],
    enums,
    enumAliases,
    enumItemRenamings
  },
});

function replaceWithWidgetFactory({
  uid,
  from: { componentNameProp, componentConfigProp },
  to: { factoryName, newProp },
}: {
  uid: string;
  from: {
    componentNameProp: string;
    componentConfigProp: string;
  };
  to: {
    factoryName: AspNet.WidgetFactoryKind;
    newProp: string;
  };
}): Mutation<AspNet.WidgetFactory>[] {
  return [
    {
      kind: 'remove',
      uid: new RegExp(`${uid}\\.(${componentNameProp}|${componentConfigProp})`),
    },
    {
      kind: 'add',
      uid: `${uid}.${newProp}`,
      types: [
        {
          kind: 'custom',
          name: 'WidgetFactory',
          params: {
            factory: factoryName,
            componentNameProp,
            componentConfigProp,
          },
        },
      ],
    },
  ];
}
