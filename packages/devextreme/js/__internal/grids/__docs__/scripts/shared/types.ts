export interface HeritageInfo {
  baseClass: string;
  mixins: string[];
}

export interface BaseClassInfo extends HeritageInfo {
  className: string;
  sourceFile: string;
  isExported: boolean;
}

export interface InheritanceEntry {
  className: string;
  chain: string[];
}
