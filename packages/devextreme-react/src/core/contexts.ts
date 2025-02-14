import {
  Context,
  createContext,
} from 'react';

import { IExpectedChild, IOptionDescriptor } from './configuration/react/element';
import { IConfigNode } from './configuration/config-node';

export interface UpdateLocker {
  lock: () => void;
  unlock: () => void;
}

export const RemovalLockerContext: Context<UpdateLocker | undefined> = createContext<UpdateLocker | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/no-extra-parens
export const RestoreTreeContext: Context<(() => void) | undefined> = createContext<(() => void) | undefined>(undefined);

export interface NestedOptionContextContent {
  parentExpectedChildren: Record<string, IExpectedChild> | undefined;
  parentFullName: string;
  parentType: 'component' | 'option';
  onChildOptionsReady: (
    configNode: IConfigNode,
    optionDescriptor: IOptionDescriptor,
    childUpdateToken: symbol,
    optionComponentKey: number
  ) => void;
  getOptionComponentKey: () => number;
  treeUpdateToken: symbol;
}

export const NestedOptionContext = createContext<NestedOptionContextContent>({
  parentExpectedChildren: {},
  parentFullName: '',
  onChildOptionsReady: () => undefined,
  getOptionComponentKey: () => 0,
  treeUpdateToken: Symbol('initial tree update token'),
  parentType: 'component',
});

export interface TemplateRenderContextContent {
  isTemplateRendering?: boolean;
}

export const TemplateRenderingContext = createContext<TemplateRenderContextContent>({
  isTemplateRendering: false,
});
