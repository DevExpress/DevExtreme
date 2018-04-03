# README for Developers

We use the [Fork-and-Branch workflow](http://blog.scottlowe.org/2015/01/27/using-fork-branch-git-workflow/). Start with [forking the repository](https://help.github.com/articles/fork-a-repo/), then create a branch to which you commit modifications.

**Don't clone the main repository!**

[Create a pull request](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) to one of the main branches (e.g. `16_2`) when you are ready to submit your changes. Each pull request should pass all automatic checks and at least one member of the DevExtreme team should [review](https://help.github.com/articles/about-pull-request-reviews/) it.

Make sure that you properly configure your Git [username](https://help.github.com/articles/setting-your-username-in-git) and [email](https://help.github.com/articles/setting-your-email-in-git).

## Install Required Software

To set up a build environment, you need the following software installed:

- [Node.js and npm](https://nodejs.org/en/download/). We recommend the LTS version.
- [.NET Core SDK](https://www.microsoft.com/net/download/core).
- A web browser for development. We recommend Google Chrome.

## Building

Install packages using the following command:

    npm install

After installation, the following NPM scripts are available:

- `npm run lint` - Executes linters
- `npm run build` - Builds DevExtreme in the Debug mode
- `npm run build-dist` - Builds DevExtreme in the Release mode
- `npm run build-themes` - Use this script to rebuild CSS themes only

Build results are stored in the "artifacts" directory.

## Tests and CI

We conduct extensive in-house testing of DevExtreme on different browsers, mobile devices, functional tests for demos, etc. However, we only share some of them on GitHub: linters and automated tests for Google Chrome.

You can execute tests in the [testing](testing) directory as described below:

### Locally in Browser

Run the "testing/launch" (for Mac and Linux) or "testing/launch.cmd" (for Windows) command to start the testing server and open the test execution UI in the default browser. This is the main way of testing and debugging.

### Locally in Docker

If you have [Docker](https://docs.docker.com/engine/installation/) installed, you can run tests in the same environment as the online Continuous Integration. Use the following command:

```
docker run --rm -ti -e TARGET=test -v REPO_PATH:/devextreme devexpress/devextreme-build:TAG ./docker-ci.sh
```

Make the following replacements in the command line:

- `REPO_PATH` - absolute path to the local git repository.
- `TAG` - a Docker image tag. It should match the parent branch name (e.g. `16_2`). You can find the list of available tags on our [Docker Hub page](https://hub.docker.com/r/devexpress/devextreme-build/tags/).

The Dockerfile for building "devexpress/devextreme-build" images is in the [build/docker-image](build/docker-image/Dockerfile) directory.

A VNC server is available within the running container. To track test execution, add the `-p 5900:5900` parameter to the `docker run` command and connect to "localhost:5900" using any VNC client.

### In a Cloud CI

We provide configuration YAML files for [Travis CI](https://travis-ci.org/) ([.travis.yml](.travis.yml)) and [Shippable](https://app.shippable.com/) ([shippable.yml](shippable.yml)). Enable one of them for your forked repo (we recommend Travis).

Please make sure that each pull request passes all automatic checks before submitting it.

## Commit Message & Pull Request Title Guidelines

- Use the imperative mood in the subject line
- Capitalize the subject line
- Do not end the subject line with a period
- Limit the subject line to 50 characters
- If applicable, include an issue ID to the subject line. Feel free to use [GitHub keywords](https://help.github.com/articles/closing-issues-using-keywords/) to close the related issues automatically
- Optionally, put any additional details, references, examples, etc. in the commit message body or PR description

Examples:

- `Mark dxCommand as DOMComponent child (TXXXXX)`
- `Refactor ContextMenu after T560055 fix`
- `Add namespace to doc comments (resolves #XXXX)`
- `Fix editorFactory tests in IE`
