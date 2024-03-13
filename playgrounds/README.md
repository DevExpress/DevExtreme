# DevExtreme Playgrounds

These playgrounds are intended for testing purposes.

To run a playground, clone this repository and follow the instructions below.

## Prepare the devextreme package

Before you run a playground, install modules and build the devextreme package. Run the following scripts from the root directory of this repository:
```
npm install
npm run build -w=devextreme-main
```

## Angular playground
> **_NOTE:_** Requires Node v17+
1. Prepare the devextreme-angular package:
```
npm run pack -w=devextreme-angular
```
2. Run the launch script:
```
cd apps/angular
npm run start
```

## React playground
1. Prepare the devextreme-react package:
```
npm run pack -w=devextreme-react
```
2. Run the launch script:
```
cd apps/react
npm run start
```

## Vue playground
1. Prepare the devextreme-vue package:
```
npm run pack -w=devextreme-vue
```
2. Run the launch script:
```
cd apps/vue
npm run start
```

## Update DevExtreme code

To observe the changes made to the DevExtreme code within playgrounds, rebuild the `devextreme` package.
```
npm run build -w=devextreme-main
```
If you need your changes to apply dynamically without reloading the playground, save them in the following directory:
```
packages\devextreme\artifacts\npm\devextreme\esm
```
