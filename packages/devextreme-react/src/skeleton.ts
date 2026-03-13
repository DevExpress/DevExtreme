"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxSkeleton, {
    Properties
} from "devextreme/ui/skeleton";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent } from "devextreme/ui/skeleton";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ISkeletonOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
}

type ISkeletonOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ISkeletonOptionsNarrowedEvents> & IHtmlOptions>

interface SkeletonRef {
  instance: () => dxSkeleton;
}

const Skeleton = memo(
  forwardRef(
    (props: React.PropsWithChildren<ISkeletonOptions>, ref: ForwardedRef<SkeletonRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), []);

      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized"]), []);

      const expectedChildren = useMemo(() => ({
        rootComplexOption: { optionName: "rootComplexOption", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ISkeletonOptions>>, {
          WidgetClass: dxSkeleton,
          ref: baseRef,
          independentEvents,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ISkeletonOptions> & { ref?: Ref<SkeletonRef> }) => ReactElement | null;


// owners:
// Skeleton
type IRootComplexOptionProps = React.PropsWithChildren<{
  prop1?: string;
  prop2?: boolean;
}>
const _componentRootComplexOption = (props: IRootComplexOptionProps) => {
  return React.createElement(NestedOption<IRootComplexOptionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "rootComplexOption",
    },
  });
};

const RootComplexOption = Object.assign<typeof _componentRootComplexOption, NestedComponentMeta>(_componentRootComplexOption, {
  componentType: "option",
});

export default Skeleton;
export {
  Skeleton,
  ISkeletonOptions,
  SkeletonRef,
  RootComplexOption,
  IRootComplexOptionProps
};
import type * as SkeletonTypes from 'devextreme/ui/skeleton_types';
export { SkeletonTypes };

