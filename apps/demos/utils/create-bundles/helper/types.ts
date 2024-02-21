export type Framework = 'React' | 'Vue';

export type Args = {
  framework: Framework,
  'copy-metadata': boolean,
};

export interface Demo {
  Title: string;
  Name: string;
  DocUrl: string;
  Widget: string;
  DemoType: string;
}

export interface Group {
  Name: string;
  Equivalents: string;
  Demos: Demo[];
}

export interface Item {
  Name: string;
  Equivalents: string;
  Groups: Group[];
}
