import ConverterController from '../m_converterController';
import type { Delta, QuillInstance } from '../types/quill';

class DeltaConverter {
  quillInstance: QuillInstance | null = null;

  setQuillInstance(quillInstance: QuillInstance): void {
    this.quillInstance = quillInstance;
  }

  toHtml(): string | undefined {
    if (!this.quillInstance) {
      return undefined;
    }

    return this._isQuillEmpty()
      ? ''
      : this.quillInstance.getSemanticHTML(0, this.quillInstance.getLength() + 1);
  }

  private _isQuillEmpty(): boolean {
    if (!this.quillInstance) {
      return true;
    }

    const delta = this.quillInstance.getContents();

    return delta.length() === 1 && DeltaConverter._isDeltaEmpty(delta);
  }

  private static _isDeltaEmpty(delta: Delta): boolean {
    return delta.reduce<boolean>((_, operation) => {
      if (typeof operation.insert === 'string') {
        return operation.insert.includes('\n');
      }
      return false;
    }, false);
  }
}

ConverterController.addConverter('delta', DeltaConverter);

export default DeltaConverter;
