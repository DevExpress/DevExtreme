export function Component(args: {
    name: string;
    components: [];
    viewModel: Function;
    view: Function;
}) {
    return function ComponentDecorator(constructor: Function) { }
}

export function Prop() {
    return function PropDecorator(target: any, propertyKey: string) { }
}

export function Event() {
    return function EnventDecorator(target: any, propertyKey: string) { }
}

export function InternalState() {
    return function EnventDecorator(target: any, propertyKey: string) { }
}

export function Listen(eventName?: string, parameters?: { target?: Document | Window | string }) {
    return function EnventDecorator(target: any, propertyKey: string) { }
}

export declare namespace JSX {
    interface Element { }
    interface IntrinsicElements { div: any; }
}

