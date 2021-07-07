// eslint-disable-next-line @typescript-eslint/no-type-alias
export type EventCallback<T = undefined> = T extends undefined ? () => void : (value: T) => void;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/no-extraneous-class */
class WorkaroundForVue {
  // TODO: empty class as a WA for https://github.com/DevExpress/devextreme-renovation/issues/725
}
