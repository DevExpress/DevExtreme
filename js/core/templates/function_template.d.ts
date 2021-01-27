import { dxElement } from "../element";

export class FunctionTemplate {
  render(template: {
    container: unknown,
    model?: object,
    transclude?: boolean
  }): dxElement;
}
