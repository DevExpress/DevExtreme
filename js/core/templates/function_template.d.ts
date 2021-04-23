import { DxElement } from "../element";

export class FunctionTemplate {
  render(template: {
    container: unknown,
    model?: object,
    transclude?: boolean
  }): DxElement;
}
