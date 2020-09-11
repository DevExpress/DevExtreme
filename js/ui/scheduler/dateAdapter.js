import dateUtils from '../../core/utils/date';

const toMs = dateUtils.dateToMilliseconds;

class DateAdapterCore {
    constructor(source) {
        this._source = new Date(source.getTime ? source.getTime() : source);
    }

    get source() { // TODO
        return this._source;
    }

    result() {
        return this._source;
    }

    getTimezoneOffset(format = undefined) {
        const value = this._source.getTimezoneOffset();
        if(format === 'minute') {
            return value * toMs('minute');
        }
        return value;
    }

    getTime() {
        return this._source.getTime();
    }

    setTime(value) {
        this._source.setTime(value);
        return this;
    }

    addTime(value) {
        this._source.setTime(this._source.getTime() + value);
        return this;
    }


    setMinutes(value) {
        this._source.setMinutes(value);
        return this;
    }

    addMinutes(value) {
        this._source.setMinutes(this._source.getMinutes() + value);
        return this;
    }

    subtractMinutes(value) {
        this._source.setMinutes(this._source.getMinutes() - value);
        return this;
    }
}

const DateAdapter = (date) => new DateAdapterCore(date);

export default DateAdapter;
