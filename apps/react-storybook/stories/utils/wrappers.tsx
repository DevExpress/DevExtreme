import React, { useRef, useEffect } from "react";
import * as inferno from "inferno";

export function wrapInfernoWithReact<TProps>(component) {
  return function WrappedInfernoComponent(props: TProps) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      inferno.render(
        inferno.createComponentVNode(0, component, props as any),
        ref.current
      );
    });
  
    return <div ref={ref} />;  
  }
}

export function wrapDxWithReact<TProps>(component) {
  return function WrappedDxComponent(props: TProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const componentRef = useRef<{ option: (...args: any) => void }>();

    useEffect(() => {
      if (!componentRef.current) {
        componentRef.current = new component(ref.current, props);
      } else {
        componentRef.current.option(props);
      }
    });

    return <div ref={ref} />;  
  }
}
