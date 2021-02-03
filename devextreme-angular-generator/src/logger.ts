import yargs = require('yargs');

let argv = yargs
    .default('verbose', false)
    .argv;

export default function(...args) {
    if (argv.verbose) {
        console.log.apply(console, args);
    }
};
