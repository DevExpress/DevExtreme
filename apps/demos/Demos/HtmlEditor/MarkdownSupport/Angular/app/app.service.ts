import { Injectable } from '@angular/core';

const markup = `## ![HtmlEditor](../../../../images/widgets/HtmlEditor.svg) Formatted Text Editor (HTML Editor)

Lists:

1. Use numbers followed by a period for an ordered list.
1. Use a single asterisk for a bullet list.

Formats:

* Enclose a word in single asterisks for *italic*.
* Enclose a word in double asterisks for **bold**.
`;

@Injectable()
export class Service {
  getMarkup(): string {
    return markup;
  }
}
