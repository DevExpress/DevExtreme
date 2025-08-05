const JSDOMEnvironment = require('jest-environment-jsdom').TestEnvironment;

module.exports = class TimezoneAwareJSDOMEnvironment extends JSDOMEnvironment {
    constructor(config, context) {
        // eslint-disable-next-line spellcheck/spell-checker
        const { timezone } = context.docblockPragmas;
        if(timezone) {
            process.env.TZ = timezone;
        }

        super(config, context);
    }
};
