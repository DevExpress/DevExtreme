const isModuleNotFoundInPnpmSymlinks = (error) => error.code === 'MODULE_NOT_FOUND';

const resolveWithJest = (request, options) => options.defaultResolver(request, options);

const resolveWithNodeFollowingPnpmSymlinks = (request, basedir) =>
  require.resolve(request, { paths: [basedir] });

function pnpmCompatibleResolver(request, options) {
  try {
    return resolveWithJest(request, options);
  } catch (jestFailedToFollowPnpmSymlinks) {
    if (isModuleNotFoundInPnpmSymlinks(jestFailedToFollowPnpmSymlinks)) {
      try {
        return resolveWithNodeFollowingPnpmSymlinks(request, options.basedir);
      } catch {
        throw jestFailedToFollowPnpmSymlinks;
      }
    }
    throw jestFailedToFollowPnpmSymlinks;
  }
}

module.exports = pnpmCompatibleResolver;
