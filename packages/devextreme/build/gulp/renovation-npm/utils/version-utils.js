module.exports = {
    parse: (versionString) => {
        const splitted = versionString.split('-');
        const mmb = splitted.splice(0, 1)[0];
        const suffix = splitted.join('-');
        const [major, minor, build] = mmb.split('.');

        return {
            major,
            minor,
            build,
            suffix
        }
    },
    stringify: (version) => {
        const mmb = [version.major, version.minor, version.build].filter(x => !!x).join('.');
        return [mmb, version.suffix].filter(x => !!x).join('-');
    }
}

