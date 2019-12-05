const envTail = 'DEVEXTREME_TMP_TAIL';

if(!process.env[envTail]) {
    const date = new Date();
    const padStart = (number) => ('0' + number).slice(-2);
    const hours = padStart(date.getHours());
    const minutes = padStart(date.getMinutes());

    // We need to write the tail to the env because 'gulp-multi-process' will create multiple node processes
    // which require this file multiple times
    process.env[envTail] = hours + minutes;
}

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
    return revision + '-' + process.env[envTail];
};

module.exports = (baseVersion, dxBuildLabel, dxBuildFlavor, dxBuildRevision) => {
    if(dxBuildLabel && String(dxBuildLabel).replace(/_/g, '.') !== baseVersion) {
        throw 'DXBuild label does not match version in package.json';
    }

    const minor = Number(baseVersion.split('.')[2]);
    const revision = getRevision(dxBuildRevision);
    const flavor = dxBuildFlavor || getDefaultFlavor(dxBuildLabel, minor, revision);

    return {
        product: getProductVersion(baseVersion, revision),
        package: getPackageVersion(baseVersion, flavor, revision),
        script: baseVersion
    };
};
