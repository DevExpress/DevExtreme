import React, { useRef, useEffect } from "react";
import * as inferno from "inferno";

export function wrapInfernoWithReact<TProps>(component) {
  return function WrappedInfernoComponent(props: TProps) {
    const ref = useRef();
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
    const ref = useRef();
    const componentRef = useRef();
    useEffect(() => {
      componentRef.current = new component(ref.current, props);
    }, []);
    useEffect(() => {
      componentRef.current.option(props)
    });
  
    return <div ref={ref} />;  
  }
}
