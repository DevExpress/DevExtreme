import React, { useState, useRef, useEffect } from "react";
import * as inferno from "inferno";

export function InfernoToReact(props) {
  const ref = useRef();
  useEffect(() => {
    inferno.render(
      inferno.createComponentVNode(0, props.component, props.props),
      ref.current
    );
  });

  return <div ref={ref} />;
}

export function DxToReact(props) {
  const ref = useRef();
  const componentRef = useRef();
  useEffect(() => {
    componentRef.current = new props.component(ref.current, props.props);
  }, []);
  useEffect(() => {
    componentRef.current.option(props.props)
  });

  return <div ref={ref} />;
}