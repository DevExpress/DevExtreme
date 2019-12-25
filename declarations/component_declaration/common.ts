import react from "react";

export const React = react;

export function Component(args: {
    name?: string;
    components?: [];
    viewModel: Function;
    view: Function;
}) {
    return function ComponentDecorator(constructor: Function) { }
}

const propertyDecorator = function(target: any, propertyKey: string) { };

export const Prop = () => propertyDecorator;
export const Template = () => propertyDecorator;
export const Slot = () => propertyDecorator;
export const Method = () => propertyDecorator;
export const Event = () => propertyDecorator;
export const State = () => propertyDecorator;
export const InternalState = () => propertyDecorator;
export const Listen = (eventName?: string, parameters?: { target?: Document | Window | string }) => propertyDecorator;
export const Ref = () => propertyDecorator;

export declare namespace JSX {
    interface Element { }
    interface IntrinsicElements { div: any; }
}
