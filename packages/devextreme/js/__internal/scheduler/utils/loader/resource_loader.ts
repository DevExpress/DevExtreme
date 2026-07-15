import {
  getAppointmentResourceAccessor,
  getResourceIndex,
  type ResourceIdAccessor,
} from '../data_accessor/appointment_resource_data_accessor';
import { ResourceDataAccessor } from '../data_accessor/resource_data_accessor';
import type { ResourceHierarchyNode } from '../resource_manager/hierarchy_tree_utils';
import {
  buildHierarchyTree,
  collectHierarchyLeaves,
} from '../resource_manager/hierarchy_tree_utils';
import { Loader } from './loader';
import type {
  RawResourceData,
  ResourceConfig,
  ResourceData,
} from './types';

export class ResourceLoader extends Loader<RawResourceData, ResourceData> {
  public idsGetter: ResourceIdAccessor['idsGetter'];

  public idsSetter: ResourceIdAccessor['idsSetter'];

  public dataAccessor: ResourceDataAccessor;

  public allowMultiple: boolean;

  public useColorAsDefault: boolean;

  public resourceIndex: string;

  public resourceName?: string;

  public icon?: string;

  public hasHierarchy: boolean;

  public hierarchyTree: ResourceHierarchyNode[] = [];

  public leafItems: ResourceData[] = [];

  constructor(config: ResourceConfig) {
    super(config, { pageSize: 0 });
    const accessor = getAppointmentResourceAccessor(config);

    this.idsGetter = accessor.idsGetter;
    this.idsSetter = accessor.idsSetter;
    this.dataAccessor = new ResourceDataAccessor(config);
    this.allowMultiple = Boolean(config.allowMultiple);
    this.useColorAsDefault = Boolean(config.useColorAsDefault);
    this.resourceIndex = String(getResourceIndex(config));
    this.resourceName = config.label;
    this.icon = config.icon;
    this.hasHierarchy = Boolean(config.parentIdExpr);
    this.onInit();
  }

  protected onLoadTransform(items: RawResourceData[]): ResourceData[] {
    return items.map((item) => {
      const resource: ResourceData = {
        id: this.dataAccessor.get('id', item),
        text: this.dataAccessor.get('text', item),
        color: this.dataAccessor.get('color', item),
      };

      if (this.hasHierarchy) {
        resource.parentId = this.dataAccessor.get('parentId', item) ?? null;
      }

      return resource;
    });
  }

  protected applyChanges(items: RawResourceData[]): void {
    const hasChanged = Boolean(items) && items !== this.data;

    super.applyChanges(items);

    if (hasChanged) {
      this.rebuildHierarchy();
    }
  }

  protected rebuildHierarchy(): void {
    if (!this.hasHierarchy) {
      this.hierarchyTree = [];
      this.leafItems = this.items;
      return;
    }

    this.hierarchyTree = buildHierarchyTree(this.items);
    this.leafItems = collectHierarchyLeaves(this.hierarchyTree);
  }

  protected onLoadError(): void {}

  protected onChange(): void {}

  public dispose(): void {
    super.dispose();
    this.hierarchyTree = [];
    this.leafItems = [];
  }
}
