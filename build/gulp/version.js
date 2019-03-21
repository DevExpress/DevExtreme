const getDefaultFlavor = (label, minor, revision) => {
    return label
        ? (minor <= 2 ? 'beta' : '')
        : revision
            ? (minor <= 1 ? 'alpha' : 'build')
            : 'dev';
};

const getPackageVersion = (version, flavor, revision) => {
    if(revision) {
        version = version.replace(/\d+$/, m => 1 + Number(m));
    }

    return [version, flavor, revision]
        .filter(v => v)
        .join('-');
};

const getProductVersion = (version, revision) => {
    return revision
        ? version + ' (build ' + revision + ')'
        : version;
};

const getRevision = (revision) => {
    if(!revision) return '';

    const date = new Date();
    const padStart = (number) => ('0' + number).slice(-2);

    const hours = padStart(date.getHours());
    const minutes = padStart(date.getMinutes());
    return revision + '-' + hours + minutes;
};

module.exports = (scriptVersion, dxBuildLabel, dxBuildFlavor, dxBuildRevision) => {
    if(dxBuildLabel && String(dxBuildLabel).replace(/_/g, '.') !== scriptVersion) {
        throw 'DXBuild label does not match version in package.json';
    }

    const minor = Number(scriptVersion.split('.')[2]);
    const revision = getRevision(dxBuildRevision);
    const flavor = dxBuildFlavor || getDefaultFlavor(dxBuildLabel, minor, revision);

    const packageVersion = getPackageVersion(scriptVersion, flavor, revision);
    const productVersion = getProductVersion(scriptVersion, revision);

    return {
        product: productVersion,
        package: packageVersion,
        script: scriptVersion
    };
};
