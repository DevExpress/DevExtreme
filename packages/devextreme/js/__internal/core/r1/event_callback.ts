// eslint-disable-next-line @typescript-eslint/no-type-alias
export type EventCallback<T = undefined> = T extends undefined ? () => void : (value: T) => void;

export class WorkaroundForVue {
  // TODO: empty class as a WA for https://github.com/DevExpress/devextreme-renovation/issues/725
  public dummy = '';
}
