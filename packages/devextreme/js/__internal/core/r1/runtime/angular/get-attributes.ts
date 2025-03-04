import { ElementRef } from '@angular/core';

function getStyleObject(styleText: string): Record<string, unknown> {
  const style: Record<string, unknown> = {
    toString: () => styleText,
  };
  styleText.split(';').forEach((definition) => {
    const [name, value] = definition.split(':');
    if (name && value) {
      style[name.trim()] = value.trim();
    }
  });
  return style;
}

function processStyleAttribute(attributes: Record<string, string>): Record<string, unknown> {
  if (attributes.style) {
    const styleText = attributes.style.replace(/display: contents[; ]*/, '');

    if (!styleText) {
      delete attributes.style;
      return attributes;
    }

    const style = getStyleObject(styleText);
    return { ...attributes, style };
  }

  return attributes;
}

export function getAttributes(element: ElementRef<HTMLElement>): Record<string, unknown> {
  const attributes: Record<string, string> = {};
  Array
    .from(element.nativeElement.attributes)
    .filter(({ name }) => !name.startsWith('ng-reflect'))
    .forEach(({ name, value }) => {
      attributes[name] = value;
    });

  return processStyleAttribute(attributes);
}
