import Editor from './editor';

export default class CheckBox extends Editor {
  // eslint-disable-next-line class-methods-use-this
  _useTemplates(): boolean {
    return false;
  }
}
