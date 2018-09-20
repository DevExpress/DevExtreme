
class ConverterController {
    constructor() {}

    static addConverter(name, converter) {
        ConverterController[name] = converter;
    }

    static getConverter(name) {
        return ConverterController[name];
    }
}

export { ConverterController as default };
