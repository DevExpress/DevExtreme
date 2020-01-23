import "react";
declare function JSXConstructor<T>(F: any): (props: {
    [K in keyof T]?: T[K];
} & {children?: JSX.Element} ) => JSX.Element;

export default JSXConstructor;