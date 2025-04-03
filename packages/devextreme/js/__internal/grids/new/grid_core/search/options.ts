export interface Options {
  searchPanel?: {
    // Notifies the UI component whether search is case-sensitive
    // to ensure that search results are highlighted correctly.
    // Applies only if highlightSearchText is true.
    highlightCaseSensitive?: boolean;
    // Specifies whether found substrings should be highlighted.
    highlightSearchText?: boolean;
    // Sets a search string for the search panel.
    text?: string;
  };
}

export const defaultOptions: Options = {
  searchPanel: {
    highlightCaseSensitive: false,
    highlightSearchText: true,
    text: '',
  },
};
