import type { Properties } from '@js/ui/scheduler';

export type ResourceId = string | number;

export type AppointmentResourceGroups = Record<string, ResourceId[]>;

type ResourcesConfig = Required<Properties>['resources'];

export type ResourceConfig = ResourcesConfig[number] & {
  field?: string; // old notation of fieldExpr
};

export type SafeResourceConfig = ResourceInfo & {
  dataSource: ResourceConfig['dataSource'];
};

export type RawResourceData = Record<string, string> & {
  id?: ResourceId;
  text?: string;
  color?: string;
};

export interface ResourceIdAccessor {
  idGetter: <T = Record<string, ResourceId | ResourceId[]>>(appointment: T) => ResourceId[];
  idSetter: <T = Record<string, ResourceId | ResourceId[]>>(
    appointment: T,
    ids: ResourceId | ResourceId[],
  ) => void;
}

export interface ResourceInfo extends ResourceIdAccessor {
  allowMultiple: boolean;
  useColorAsDefault: boolean;
  resourceName?: string;
  resourceIndex: string; // path to resource ids in appointment like res.id
}

export interface ResourceData extends Record<string, unknown> {
  id: ResourceId;
  text: string;
  color: string;
}

export type Resource = ResourceInfo & {
  items: ResourceData[];
};

export interface GroupNode {
  text: string;
  grouped: Record<string, ResourceId>;
  children: GroupNode[];
}

export interface GroupLeaf extends GroupNode {
  groupIndex: string | number;
}
