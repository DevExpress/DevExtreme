export interface SearchProperties {
  searchText?: string;
}

export interface HighlightTextOptions {
  enabled: boolean;
  caseSensitive: boolean;
  searchStr: string;
}

export interface HighlightedTextItem {
  type: 'highlighted' | 'usual';
  text: string;
}

export interface SearchFieldProps {
  value?: string;
  placeholder?: string;
  width?: string | number;
  onValueChanged?: (v: string) => void;
}
