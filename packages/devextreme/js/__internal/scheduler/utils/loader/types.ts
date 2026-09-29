import type { Properties } from '@js/ui/scheduler';

export type ResourceId = string | number | object;
export type AppointmentResourceConfig = ResourceId | ResourceId[];

type ResourcesConfig = Required<Properties>['resources'];

export type ResourceConfig = ResourcesConfig[number] & {
  field?: string;
  parentIdExpr?: string;
};

export type RawResourceData = Record<string, unknown> & {
  id?: ResourceId;
  text?: string;
  color?: string;
  parentId?: ResourceId | null;
};

export interface ResourceData extends Record<string, unknown> {
  id: ResourceId;
  text: string;
  color: string;
  parentId?: ResourceId | null;
}
