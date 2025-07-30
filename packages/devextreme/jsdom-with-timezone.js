const JSDOMEnvironment = require('jest-environment-jsdom').TestEnvironment;

module.exports = class TimezoneAwareJSDOMEnvironment extends JSDOMEnvironment {
    constructor(config, context) {
        // eslint-disable-next-line spellcheck/spell-checker
        process.env.TZ = context.docblockPragmas.timezone;

        super(config, context);
    }
};
