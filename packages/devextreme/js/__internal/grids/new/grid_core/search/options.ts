export interface Options {
  searchPanel?: {
    // Notifies the UI component whether search is case-sensitive
    // to ensure that search results are highlighted correctly.
    // Applies only if highlightSearchText is true.
    highlightCaseSensitive?: boolean;
    // Specifies whether found substrings should be highlighted.
    highlightSearchText?: boolean;
    // Specifies a placeholder for the search panel.
    placeholder?: string;
    // Specifies whether the UI component should search against all columns or only visible ones.
    searchVisibleColumnsOnly?: boolean;
    // Sets a search string for the search panel.
    text?: string;
    // Specifies whether the search panel is visible or not.
    visible?: boolean;
    // Specifies the width of the search panel.
    width?: string | number;
  };
}

export const defaultOptions: Options = {
  searchPanel: {
    highlightCaseSensitive: false,
    highlightSearchText: true,
    placeholder: undefined,
    searchVisibleColumnsOnly: false,
    text: '',
    visible: false,
    width: 160,
  },
};
