/* eslint-disable max-classes-per-file */
import {
  ComponentBindings, OneWay, JSXComponent, Component,
} from 'devextreme-generator/component_declaration/common';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { h } from 'preact';
import React from 'react';

export const viewFunction = ({ props: { message, className }, restAttributes }: ErrorMessage) => (
  <div
    className={`dx-validationsummary dx-validationsummary-item ${className}`}
      /* eslint-disable react/jsx-props-no-spreading */
    {...restAttributes}
  >
    {message}
  </div>
);


@ComponentBindings()
export class ErrorMessageProps {
  @OneWay() className?: string = '';

  @OneWay() message?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class ErrorMessage extends JSXComponent<ErrorMessageProps>(ErrorMessageProps) {}
