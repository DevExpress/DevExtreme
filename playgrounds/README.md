# DevExtreme Playgrounds

These playgrounds are intended for testing purposes.

To run a playground, clone this repository and follow the instructions below.

## Prepare the devextreme package

Before anything else, you need to install modules and build the devextreme package. Run the following scripts from the root directory of this repository:
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
cd playgrounds/angular
npm run start
```

## React playground
1. Prepare the devextreme-react package:
```
npm run pack -w=devextreme-react
```
2. Run the launch script:
```
cd playgrounds/react
npm run start
```

## Vue playground
1. Prepare the devextreme-vue package:
```
npm run pack -w=devextreme-vue
```
2. Run the launch script:
```
cd playgrounds/vue
npm run start
```

## Updating devextreme code

To see changes applied to devextreme code in playgrounds, you need to re-build the devextreme package.
```
npm run build -w=devextreme-main
```
If you want hot update, apply changes to the following directory:
```
packages\devextreme\artifacts\npm\devextreme\esm
```