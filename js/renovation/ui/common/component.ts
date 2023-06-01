export interface ComponentExt {
  _options: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    silent: (path: any, value: any) => void;
  };
}
