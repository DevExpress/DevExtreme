import * as React from 'react';
// eslint-disable-next-line
export function __collectChildren(children: React.ReactNode): Record<string, any> {
  return (
    React.Children.toArray(children).filter(
      (child) => React.isValidElement(child) && typeof child.type !== 'string',
    ) as (React.ReactElement & { type: { propName: string } })[]
  ).reduce((acc: Record<string, any>, child) => {
    const {
      children: childChildren,
      __defaultNestedValues,
      ...childProps
    } = child.props;
    const collectedChildren = __collectChildren(childChildren);
    const childPropsValue = Object.keys(childProps).length
      ? childProps
      : __defaultNestedValues;
    const allChild = { ...childPropsValue, ...collectedChildren };
    return {
      ...acc,
      [child.type.propName]: acc[child.type.propName]
        ? [...acc[child.type.propName], allChild]
        : [allChild],
    };
  }, {});
}
