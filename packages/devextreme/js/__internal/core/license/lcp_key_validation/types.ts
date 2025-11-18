/* eslint-disable spellcheck/spell-checker, no-bitwise */
import { bit } from './utils';

const productKind = {
  Default: 0n,
  DXperienceWin: bit(0),
  XtraReports: bit(4),
  XPO: bit(15),
  DevExtremeAspNet: bit(17),
  DXperienceASP: bit(25),
  XAF: bit(28),
  Blazor: bit(31),
  DXperienceWPF: bit(38),
  DocsBasic: bit(39),
  Dashboard: bit(47),
  Snap: bit(49),
  DevExtremeHtmlJs: bit(54),
  Docs: bit(55),
  XtraReportsWpf: bit(57),
  XtraReportsWeb: bit(59),
  XtraReportsWin: bit(60),
  XtraReportsBlazor: bit(41),
  DXperienceEnt: bit(0),
  DXperienceUni: bit(0),
};

productKind.DXperienceEnt = productKind.Blazor
  | productKind.DXperienceWin
  | productKind.XtraReports
  | productKind.Snap
  | productKind.XtraReportsWin
  | productKind.XPO
  | productKind.DXperienceASP
  | productKind.DXperienceWPF
  | productKind.XtraReportsWeb
  | productKind.XtraReportsWpf
  | productKind.XtraReportsBlazor
  | productKind.DevExtremeAspNet
  | productKind.DevExtremeHtmlJs;

productKind.DXperienceUni = productKind.DXperienceEnt
  | productKind.XAF
  | productKind.DXperienceWPF
  | productKind.Dashboard
  | productKind.Docs;

export const ProductKind = Object.freeze(productKind);
