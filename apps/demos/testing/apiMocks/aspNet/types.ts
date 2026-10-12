export interface Summary {
  selector: string;
  summaryType: string;
}

export interface SortDescriptor {
  selector: string;
  desc?: boolean;
}

export type Row = Record<string, unknown>;
