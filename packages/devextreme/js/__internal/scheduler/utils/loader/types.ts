import type { Properties } from '@js/ui/scheduler';

export type ResourceId = string | number | object;
export type AppointmentResourceConfig = ResourceId | ResourceId[];

type ResourcesConfig = Required<Properties>['resources'];

export type ResourceConfig = ResourcesConfig[number] & {
  field?: string; // old notation of fieldExpr
  parentResource?: string; // parent resource field name
  parentFieldExpr?: string; // field in raw data that contains parent value
};

export type RawResourceData = Record<string, string> & {
  id?: ResourceId;
  text?: string;
  color?: string;
};

export interface ResourceData extends Record<string, unknown> {
  id: ResourceId;
  text: string;
  color: string;
}
