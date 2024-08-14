# DevExtreme Playgrounds

These playgrounds are intended for testing purposes.

To run a playground, clone this repository and follow the instructions below.

## Prepare the devextreme package

Before you run a playground, install modules and build the devextreme package. Run the following scripts from the root directory of this repository:
```
pnpm install
pnpm run build -w=devextreme
```

## Angular playground
> **_NOTE:_** Requires Node v17+
1. Prepare the devextreme-angular package:
```
pnpm run pack -w=devextreme-angular
```
2. Run the launch script:
```
cd apps/angular
pnpm run start
```

## React playground
1. Prepare the devextreme-react package:
```
pnpm run pack -w=devextreme-react
```
2. Run the launch script:
```
cd apps/react
pnpm run start
```

## Vue playground
1. Prepare the devextreme-vue package:
```
pnpm run pack -w=devextreme-vue
```
2. Run the launch script:
```
cd apps/vue
pnpm run start
```

## Update DevExtreme code

To observe the changes made to the DevExtreme code within playgrounds, rebuild the `devextreme` package.
```
pnpm run build -w=devextreme
```
If you need your changes to apply dynamically without reloading the playground, save them in the following directory:
```
packages\devextreme\artifacts\npm\devextreme\esm
```
