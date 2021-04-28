export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg';

export type LabelLocation = 'top' | 'left';

export type OnFieldDataChangedCallback = ((component: any, dataField: string,
  element: HTMLDivElement, model: any, value: any) => void) | null;

export type OnEditorEnterKeyCallback = ((component: any, dataField: string,
  element: HTMLDivElement, model: any) => void) | null;

export type OnCustomizeItemCallback = ((item: any) => void) | null;

export type StylingMode = 'outlined' | 'underlined' | 'filled';

export interface ColCountByScreen {
  lg: number;
  md: number;
  sm: number;
  xs: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FormItem {}
