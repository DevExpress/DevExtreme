const JSDOMEnvironment = require('jest-environment-jsdom').TestEnvironment;

module.exports = class TimezoneAwareJSDOMEnvironment extends JSDOMEnvironment {
    constructor(config, context) {
        // eslint-disable-next-line spellcheck/spell-checker
        const { timezone } = context.docblockPragmas;

        const previousTimezone = process.env.TZ;

        if(timezone) {
            process.env.TZ = timezone;
        }

        super(config, context);

        this._previousTimezone = previousTimezone;
        this._timezoneApplied = Boolean(timezone);
    }

    async teardown() {
        await super.teardown();

        if(this._timezoneApplied) {
            if(this._previousTimezone === undefined) {
                delete process.env.TZ;
            } else {
                process.env.TZ = this._previousTimezone;
            }
        }
    }
};
