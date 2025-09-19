import type { Properties } from '@js/ui/button_group';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';
import type { CollectionProps } from '@ts/ui/collection_inferno/collection.component';
import type { InfernoNode, RefObject } from 'inferno';
import { createRef } from 'inferno';

import type { ItemRenderedEvent } from '../button_group';
import { BaseButtonCollection } from './base_button_collection';

const BUTTON_GROUP_WRAPPER = 'dx-buttongroup-wrapper';

export type ButtonCollectionProps = CollectionProps<Properties> & {
  noDataText?: string;
  selectionRequired?: boolean;
  onItemRendered?: (e: ItemRenderedEvent) => void;
  elementRef?: RefObject<HTMLDivElement>;
  className?: string;
  onComponentMounted?: (component: BaseButtonCollection) => void;
};

export class ButtonCollectionComponent extends
  BaseInfernoComponent<ButtonCollectionProps> {
  protected readonly ref: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();

  protected component?: BaseButtonCollection;

  protected getComponentOptions(): ButtonCollectionProps {
    const {
      elementRef,
      className,
      onComponentMounted,
      ...componentOptions
    } = this.props;

    return componentOptions;
  }

  protected updateComponentOptions(
    prevProps: ButtonCollectionProps,
  ): void {
    const componentOptions = this.getComponentOptions();
    const { elementRef, className, ...prevComponentOptions } = prevProps;

    Object.keys(componentOptions as object).forEach((key) => {
      if (componentOptions[key] !== prevComponentOptions[key]) {
        this.component?.option(key, componentOptions[key]);
      }
    });
  }

  protected createComponent(
    ref: RefObject<HTMLDivElement>,
    props: ButtonCollectionProps,
  ): BaseButtonCollection {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return new BaseButtonCollection(ref.current!, props as unknown as Record<string, unknown>);
  }

  public componentDidMount(): void {
    this.component = this.createComponent(this.getElementRef(), this.getComponentOptions());
    this.props.onComponentMounted?.(this.component);
  }

  public componentDidUpdate(prevProps: ButtonCollectionProps): void {
    this.updateComponentOptions(prevProps);
  }

  public componentWillUnmount(): void {
    this.component?.dispose();
  }

  private getElementRef(): RefObject<HTMLDivElement> {
    return this.props.elementRef ?? this.ref;
  }

  public render(): InfernoNode {
    const elementRef = this.getElementRef();

    return (
      <div ref={elementRef} className={BUTTON_GROUP_WRAPPER}/>
    );
  }
}
