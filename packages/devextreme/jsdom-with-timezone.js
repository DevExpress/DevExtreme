const JSDOMEnvironment = require('jest-environment-jsdom').TestEnvironment;

module.exports = class TimezoneAwareJSDOMEnvironment extends JSDOMEnvironment {
    constructor(config, context) {
        // eslint-disable-next-line
        const { timezone } = context.docblockPragmas;
        if(timezone) {
            // eslint-disable-next-line
            process.env.TZ = timezone;
        }

        super(config, context);
    }
};
