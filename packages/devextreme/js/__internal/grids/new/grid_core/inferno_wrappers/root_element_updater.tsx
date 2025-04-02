/* eslint-disable spellcheck/spell-checker */
import type { RefObject } from 'inferno';
import { Component } from 'inferno';

export function normalizeEventName(name: string): string {
  return name.substring(2).toLowerCase();
}
export type Properties = JSX.IntrinsicElements['div'] & {
  rootElementRef: RefObject<HTMLDivElement>;
};

export class RootElementUpdater extends Component<Properties> {
  private previousClasses: string[] = [];

  private previousAttributes: Record<string, unknown> = {};

  public render(): JSX.Element {
    return <>
      {this.props.children}
    </>;
  }

  private updateClasses(element: HTMLDivElement): void {
    const currentClassName = this.props.className;

    const currentClasses = currentClassName?.split(' ') ?? [];

    const addedClasses = currentClasses.filter((cls) => !this.previousClasses.includes(cls));
    const removedClasses = this.previousClasses.filter((cls) => !currentClasses.includes(cls));

    addedClasses.forEach((cls) => {
      element.classList.add(cls);
    });

    removedClasses.forEach((cls) => {
      element.classList.remove(cls);
    });

    this.previousClasses = currentClasses;
  }

  private updateAttributes(element: HTMLDivElement): void {
    const {
      rootElementRef,
      ref,
      className,
      children,
      ...currentAttributes
    } = this.props;

    const currentAttributeKeys = Object.keys(currentAttributes);
    const previousAttributeKeys = Object.keys(this.previousAttributes);

    currentAttributeKeys.forEach((attrName) => {
      if (attrName.startsWith('on')) {
        if (previousAttributeKeys.includes(attrName)) {
          element.removeEventListener(
            normalizeEventName(attrName),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.previousAttributes[attrName] as any,
          );
        }
        element.addEventListener(normalizeEventName(attrName), currentAttributes[attrName]);
      } else {
        element[attrName] = currentAttributes[attrName];
      }
    });

    const removedAttrKeys = previousAttributeKeys
      .filter((attrName) => !currentAttributeKeys.includes(attrName));

    removedAttrKeys.forEach((attrName) => {
      if (attrName.startsWith('on')) {
        element.removeEventListener(
          normalizeEventName(attrName),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.previousAttributes[attrName] as any,
        );
      } else {
        element.removeAttribute(attrName);
      }
    });

    this.previousAttributes = currentAttributes;
  }

  private updateClassesAndAttributes(): void {
    const element = this.props.rootElementRef.current;

    if (!element) {
      throw new Error('root element is not providen');
    }

    this.updateClasses(element);
    this.updateAttributes(element);
  }

  public componentDidMount(): void {
    this.updateClassesAndAttributes();
  }

  public componentDidUpdate(): void {
    this.updateClassesAndAttributes();
  }
}
