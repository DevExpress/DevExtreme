# Install NPM packages
1. to root package.json: `npm i axios`
2. to workspace: `npm i axios -w ./apps/react`

# Add workspace
`npm init -w ./path/to/project`

This command will add a nested `package.json` and update workspaces in the root `package.json`.

# Code generation
It uses the framework's CLIs (like `create-react-app`, `@angular/cli`, etc.) to do the same in a common way.
0. Use the `--dry-run` param to check any NX CLI command.
Use `npx nx ...` if you don't set `nx` globally.
1. Apps/libraries - [Docs](https://nx.dev/nx/generate)
#### common `nx g app myapp` [doc](https://nx.dev/packages/nest/generators/application)

#### angular (require @nrwl/angular package):
```
nx generate @nrwl/angular:app myapp => add app to ./playgrounds/myapp
nx generate @nrwl/angular:library mylibrary => add lib to ./packages/mylibrary
```
Hint1: paths for app/libs described in `nx.json` | workspaceLayout.

Hint2: libraries will be automatically added to the root `tsconfig.base.json`
and you can import them by their `package.json` names.
If you don't use NX CLI, you need to add libraries manually.

#### react:
```
nx generate @nrwl/react:app myapp
nx generate @nrwl/react:library mylibrary
```
2. Controllers/services [Docs](https://nx.dev/packages/nest/generators/controller)
```
nx g controller my-controller --dry-run
```

# Misc
1. Dependency graph: `npx nx graph`
