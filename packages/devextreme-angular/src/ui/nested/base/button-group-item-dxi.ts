/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import DevExpress from 'devextreme/bundles/dx.all';
import { dxBoxOptions } from 'devextreme/ui/box';
import { dxButtonOptions } from 'devextreme/ui/button';
import { ItemClickEvent } from 'devextreme/ui/drop_down_button';
import { dxTabPanelOptions } from 'devextreme/ui/tab_panel';

@Component({
    template: ''
})
export abstract class DxiButtonGroupItem extends CollectionNestedOption {
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    get html(): string {
        return this._getOption('html');
    }
    set html(value: string) {
        this._setOption('html', value);
    }

    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }

    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }

    get titleTemplate(): any {
        return this._getOption('titleTemplate');
    }
    set titleTemplate(value: any) {
        this._setOption('titleTemplate', value);
    }

    get visible(): boolean | undefined {
        return this._getOption('visible');
    }
    set visible(value: boolean | undefined) {
        this._setOption('visible', value);
    }

    get onClick(): Function {
        return this._getOption('onClick');
    }
    set onClick(value: Function) {
        this._setOption('onClick', value);
    }

    get stylingMode(): string {
        return this._getOption('stylingMode');
    }
    set stylingMode(value: string) {
        this._setOption('stylingMode', value);
    }

    get type(): string {
        return this._getOption('type');
    }
    set type(value: string) {
        this._setOption('type', value);
    }

    get baseSize(): number | string {
        return this._getOption('baseSize');
    }
    set baseSize(value: number | string) {
        this._setOption('baseSize', value);
    }

    get box(): dxBoxOptions | undefined {
        return this._getOption('box');
    }
    set box(value: dxBoxOptions | undefined) {
        this._setOption('box', value);
    }

    get ratio(): number {
        return this._getOption('ratio');
    }
    set ratio(value: number) {
        this._setOption('ratio', value);
    }

    get shrink(): number {
        return this._getOption('shrink');
    }
    set shrink(value: number) {
        this._setOption('shrink', value);
    }

    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }

    get hint(): string {
        return this._getOption('hint');
    }
    set hint(value: string) {
        this._setOption('hint', value);
    }

    get beginGroup(): boolean {
        return this._getOption('beginGroup');
    }
    set beginGroup(value: boolean) {
        this._setOption('beginGroup', value);
    }

    get closeMenuOnClick(): boolean {
        return this._getOption('closeMenuOnClick');
    }
    set closeMenuOnClick(value: boolean) {
        this._setOption('closeMenuOnClick', value);
    }

    get items(): Array<DevExpress.ui.dxContextMenuItem | DevExpress.ui.dxFormSimpleItem | DevExpress.ui.dxFormGroupItem | DevExpress.ui.dxFormTabbedItem | DevExpress.ui.dxFormEmptyItem | DevExpress.ui.dxFormButtonItem | DevExpress.ui.dxDiagramCustomCommand | DevExpress.ui.dxFileManagerContextMenuItem | any | string | DevExpress.ui.dxMenuItem | DevExpress.ui.dxTreeViewItem> {
        return this._getOption('items');
    }
    set items(value: Array<DevExpress.ui.dxContextMenuItem | DevExpress.ui.dxFormSimpleItem | DevExpress.ui.dxFormGroupItem | DevExpress.ui.dxFormTabbedItem | DevExpress.ui.dxFormEmptyItem | DevExpress.ui.dxFormButtonItem | DevExpress.ui.dxDiagramCustomCommand | DevExpress.ui.dxFileManagerContextMenuItem | any | string | DevExpress.ui.dxMenuItem | DevExpress.ui.dxTreeViewItem>) {
        this._setOption('items', value);
    }

    get selectable(): boolean {
        return this._getOption('selectable');
    }
    set selectable(value: boolean) {
        this._setOption('selectable', value);
    }

    get selected(): boolean {
        return this._getOption('selected');
    }
    set selected(value: boolean) {
        this._setOption('selected', value);
    }

    get colSpan(): number | undefined {
        return this._getOption('colSpan');
    }
    set colSpan(value: number | undefined) {
        this._setOption('colSpan', value);
    }

    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    get dataField(): string | undefined {
        return this._getOption('dataField');
    }
    set dataField(value: string | undefined) {
        this._setOption('dataField', value);
    }

    get editorOptions(): any | undefined {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: any | undefined) {
        this._setOption('editorOptions', value);
    }

    get editorType(): string {
        return this._getOption('editorType');
    }
    set editorType(value: string) {
        this._setOption('editorType', value);
    }

    get helpText(): string | undefined {
        return this._getOption('helpText');
    }
    set helpText(value: string | undefined) {
        this._setOption('helpText', value);
    }

    get isRequired(): boolean | undefined {
        return this._getOption('isRequired');
    }
    set isRequired(value: boolean | undefined) {
        this._setOption('isRequired', value);
    }

    get itemType(): string {
        return this._getOption('itemType');
    }
    set itemType(value: string) {
        this._setOption('itemType', value);
    }

    get label(): { alignment?: string, location?: string, showColon?: boolean, template?: any, text?: string | undefined, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { alignment?: string, location?: string, showColon?: boolean, template?: any, text?: string | undefined, visible?: boolean }) {
        this._setOption('label', value);
    }

    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    get validationRules(): Array<DevExpress.common.RequiredRule | DevExpress.common.NumericRule | DevExpress.common.RangeRule | DevExpress.common.StringLengthRule | DevExpress.common.CustomRule | DevExpress.common.CompareRule | DevExpress.common.PatternRule | DevExpress.common.EmailRule | DevExpress.common.AsyncRule> {
        return this._getOption('validationRules');
    }
    set validationRules(value: Array<DevExpress.common.RequiredRule | DevExpress.common.NumericRule | DevExpress.common.RangeRule | DevExpress.common.StringLengthRule | DevExpress.common.CustomRule | DevExpress.common.CompareRule | DevExpress.common.PatternRule | DevExpress.common.EmailRule | DevExpress.common.AsyncRule>) {
        this._setOption('validationRules', value);
    }

    get visibleIndex(): number | undefined {
        return this._getOption('visibleIndex');
    }
    set visibleIndex(value: number | undefined) {
        this._setOption('visibleIndex', value);
    }

    get alignItemLabels(): boolean {
        return this._getOption('alignItemLabels');
    }
    set alignItemLabels(value: boolean) {
        this._setOption('alignItemLabels', value);
    }

    get caption(): string | undefined {
        return this._getOption('caption');
    }
    set caption(value: string | undefined) {
        this._setOption('caption', value);
    }

    get colCount(): number {
        return this._getOption('colCount');
    }
    set colCount(value: number) {
        this._setOption('colCount', value);
    }

    get colCountByScreen(): { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined } {
        return this._getOption('colCountByScreen');
    }
    set colCountByScreen(value: { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined }) {
        this._setOption('colCountByScreen', value);
    }

    get tabPanelOptions(): dxTabPanelOptions | undefined {
        return this._getOption('tabPanelOptions');
    }
    set tabPanelOptions(value: dxTabPanelOptions | undefined) {
        this._setOption('tabPanelOptions', value);
    }

    get tabs(): Array<any | { alignItemLabels?: boolean, badge?: string | undefined, colCount?: number, colCountByScreen?: { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined }, disabled?: boolean, icon?: string | undefined, items?: Array<DevExpress.ui.dxFormSimpleItem | DevExpress.ui.dxFormGroupItem | DevExpress.ui.dxFormTabbedItem | DevExpress.ui.dxFormEmptyItem | DevExpress.ui.dxFormButtonItem>, tabTemplate?: any | undefined, template?: any | undefined, title?: string | undefined }> {
        return this._getOption('tabs');
    }
    set tabs(value: Array<any | { alignItemLabels?: boolean, badge?: string | undefined, colCount?: number, colCountByScreen?: { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined }, disabled?: boolean, icon?: string | undefined, items?: Array<DevExpress.ui.dxFormSimpleItem | DevExpress.ui.dxFormGroupItem | DevExpress.ui.dxFormTabbedItem | DevExpress.ui.dxFormEmptyItem | DevExpress.ui.dxFormButtonItem>, tabTemplate?: any | undefined, template?: any | undefined, title?: string | undefined }>) {
        this._setOption('tabs', value);
    }

    get badge(): string {
        return this._getOption('badge');
    }
    set badge(value: string) {
        this._setOption('badge', value);
    }

    get tabTemplate(): any {
        return this._getOption('tabTemplate');
    }
    set tabTemplate(value: any) {
        this._setOption('tabTemplate', value);
    }

    get buttonOptions(): dxButtonOptions | undefined {
        return this._getOption('buttonOptions');
    }
    set buttonOptions(value: dxButtonOptions | undefined) {
        this._setOption('buttonOptions', value);
    }

    get horizontalAlignment(): string {
        return this._getOption('horizontalAlignment');
    }
    set horizontalAlignment(value: string) {
        this._setOption('horizontalAlignment', value);
    }

    get verticalAlignment(): string {
        return this._getOption('verticalAlignment');
    }
    set verticalAlignment(value: string) {
        this._setOption('verticalAlignment', value);
    }

    get locateInMenu(): string {
        return this._getOption('locateInMenu');
    }
    set locateInMenu(value: string) {
        this._setOption('locateInMenu', value);
    }

    get location(): string | Array<any | { col?: number, colspan?: number | undefined, row?: number, rowspan?: number | undefined, screen?: string | undefined }> {
        return this._getOption('location');
    }
    set location(value: string | Array<any | { col?: number, colspan?: number | undefined, row?: number, rowspan?: number | undefined, screen?: string | undefined }>) {
        this._setOption('location', value);
    }

    get menuItemTemplate(): any {
        return this._getOption('menuItemTemplate');
    }
    set menuItemTemplate(value: any) {
        this._setOption('menuItemTemplate', value);
    }

    get options(): any {
        return this._getOption('options');
    }
    set options(value: any) {
        this._setOption('options', value);
    }

    get showText(): string {
        return this._getOption('showText');
    }
    set showText(value: string) {
        this._setOption('showText', value);
    }

    get widget(): string {
        return this._getOption('widget');
    }
    set widget(value: string) {
        this._setOption('widget', value);
    }

    get height(): number {
        return this._getOption('height');
    }
    set height(value: number) {
        this._setOption('height', value);
    }

    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }

    get imageAlt(): string {
        return this._getOption('imageAlt');
    }
    set imageAlt(value: string) {
        this._setOption('imageAlt', value);
    }

    get imageSrc(): string {
        return this._getOption('imageSrc');
    }
    set imageSrc(value: string) {
        this._setOption('imageSrc', value);
    }

    get acceptedValues(): Array<string | number | boolean> {
        return this._getOption('acceptedValues');
    }
    set acceptedValues(value: Array<string | number | boolean>) {
        this._setOption('acceptedValues', value);
    }

    get formatName(): string {
        return this._getOption('formatName');
    }
    set formatName(value: string) {
        this._setOption('formatName', value);
    }

    get formatValues(): Array<string | number | boolean> {
        return this._getOption('formatValues');
    }
    set formatValues(value: Array<string | number | boolean>) {
        this._setOption('formatValues', value);
    }

    get key(): string {
        return this._getOption('key');
    }
    set key(value: string) {
        this._setOption('key', value);
    }

    get showChevron(): boolean {
        return this._getOption('showChevron');
    }
    set showChevron(value: boolean) {
        this._setOption('showChevron', value);
    }

    get linkAttr(): any {
        return this._getOption('linkAttr');
    }
    set linkAttr(value: any) {
        this._setOption('linkAttr', value);
    }

    get url(): string {
        return this._getOption('url');
    }
    set url(value: string) {
        this._setOption('url', value);
    }

    get heightRatio(): number {
        return this._getOption('heightRatio');
    }
    set heightRatio(value: number) {
        this._setOption('heightRatio', value);
    }

    get widthRatio(): number {
        return this._getOption('widthRatio');
    }
    set widthRatio(value: number) {
        this._setOption('widthRatio', value);
    }

    get expanded(): boolean {
        return this._getOption('expanded');
    }
    set expanded(value: boolean) {
        this._setOption('expanded', value);
    }

    get hasItems(): boolean | undefined {
        return this._getOption('hasItems');
    }
    set hasItems(value: boolean | undefined) {
        this._setOption('hasItems', value);
    }

    get id(): number | string | undefined {
        return this._getOption('id');
    }
    set id(value: number | string | undefined) {
        this._setOption('id', value);
    }

    get parentId(): number | string | undefined {
        return this._getOption('parentId');
    }
    set parentId(value: number | string | undefined) {
        this._setOption('parentId', value);
    }
}
