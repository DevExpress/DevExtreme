# DevExtreme ThemeBuilder

This package powers the [DevExtreme ThemeBuilder](https://js.devexpress.com/Documentation/Guide/Themes_and_Styles/ThemeBuilder/). Use the ThemeBuilder on the ([web](https://devexpress.github.io/ThemeBuilder/) or in the [command line](https://js.devexpress.com/Documentation/Guide/Common/DevExtreme_CLI/#ThemeBuilder)) to create custom DevExtreme themes.

## Bootstrap 6 alpha

ThemeBuilder uses Bootstrap `6.0.0-alpha.1`. To import its light palette, pass an
SCSS file as `inputFile` and set `bootstrapVersion: 6` (the default for SCSS
imports). Bootstrap 5 variable files must be migrated to Bootstrap 6 token maps:

```scss
@use "bootstrap" with (
  $radius: .75rem,
  $root-tokens: (--link-color: #123456),
  $form-control-tokens: (--control-bg: #f5f5f5)
);
```

An empty SCSS file imports Bootstrap's defaults. ThemeBuilder resolves token
references and `light-dark()` to the light palette and converts colors to sRGB
for DevExtreme's Sass color functions. Bootstrap JavaScript is not used.
