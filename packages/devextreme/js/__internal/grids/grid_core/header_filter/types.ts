export type EmptyDateValue = '' | false;

export type HeaderFilterGroupSelector = (data: unknown) => unknown;

export interface HeaderFilterGroupDescriptor {
  selector: string | HeaderFilterGroupSelector | undefined;
  groupInterval?: string | number;
  isExpanded?: boolean;
  compare?: (value1: unknown, value2: unknown) => number;
}

export type HeaderFilterGroupItem = HeaderFilterGroupDescriptor | HeaderFilterGroupSelector;

export type HeaderFilterGroup = HeaderFilterGroupSelector | HeaderFilterGroupItem[];
