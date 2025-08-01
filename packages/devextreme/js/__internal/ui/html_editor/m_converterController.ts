import type { QuillInstance } from './types/quill';

interface BaseConverter {
  setQuillInstance: (quillInstance: QuillInstance) => void;
  toHtml: () => string | undefined;
}

type ConverterConstructor = new () => BaseConverter;

class ConverterController {
  _converters: Record<string, ConverterConstructor> = {};

  constructor() {
    this._converters = {};
  }

  addConverter(name: string, converter: ConverterConstructor): void {
    this._converters[name] = converter;
  }

  getConverter(name: string): ConverterConstructor | undefined {
    return this._converters[name];
  }
}

const controller = new ConverterController();

export type { BaseConverter, ConverterConstructor };
export default controller;
