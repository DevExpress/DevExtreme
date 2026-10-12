// Bootstrap 6 replaces v5 Sass variables with CSS token maps.
// Source tokens are unprefixed; Bootstrap's distribution adds --bs- via PostCSS.
// Keep DevExtreme keys stable while mapping to the new root/component tokens.
export default {
  'base-font-family': '--body-font-family',
  'base-accent': '--primary-base',
  'base-bg': '--bg-body',
  'base-text-color': '--fg-body',
  'base-border-color': '--border-color',
  // V6 derives a radius scale from $radius; step 5 is the default control radius.
  'base-border-radius': '--radius-5',
  'base-border-radius-large': '--radius-7',
  'base-border-radius-small': '--radius-3',
  'base-success': '--success-base',
  'base-warning': '--warning-base',
  'base-danger': '--danger-base',
  'base-link-color': '--link-color',
  'base-hover-color': '--fg-body',
  // V6's neutral button background falls back to the semantic background scale.
  'button-normal-bg': '--bg-2',
  'button-normal-border-color': '--bg-2',
  'button-default-bg': '--primary-bg',
  'button-default-border-color': '--primary-bg',
  'button-success-bg': '--success-bg',
  'button-success-border-color': '--success-bg',
  'button-danger-bg': '--danger-bg',
  'button-danger-border-color': '--danger-bg',
  'button-border-radius': '--btn-border-radius',
  // V5's $input-* settings become --control-* tokens on .form-control.
  'texteditor-border-color': '--control-border-color',
  'texteditor-bg': '--control-bg',
  'texteditor-color': '--control-fg',
  'texteditor-border-radius': '--control-border-radius',
  // Use the primary base as the concrete focus color for the DevExtreme editor.
  'texteditor-focused-border-color': '--primary-base',
  'texteditor-placeholder-color': '--control-placeholder-color',
  'pager-page-selected-bg': '--pagination-active-bg',
  'pager-page-selected-border-color': '--pagination-active-border-color',
  'pager-page-selected-color': '--pagination-active-color',
  'tooltip-color': '--tooltip-color',
  'tooltip-bg': '--tooltip-bg',
  // Bootstrap 6 replaces Modal with the native Dialog component.
  'overlay-content-bg': '--dialog-bg',
  'overlay-border-color': '--dialog-border-color',
  'progressbar-bg': '--progress-bg',
  'progressbar-border-color': '--progress-bar-color',
  'progressbar-range-bg': '--progress-bar-bg',
  'list-border-color': '--list-group-border-color',
  // V6 names the interactive list hover token --list-group-action-hover-bg.
  'list-item-hover-bg': '--list-group-action-hover-bg',
  'list-item-selected-color': '--list-group-active-color',
  'list-item-selected-bg': '--list-group-active-bg',
  'badge-bg': '--primary-bg',
};
