/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { AsyncRule, ButtonStyle, ButtonType, CompareRule, CustomRule, EmailRule, HorizontalAlignment, NumericRule, PatternRule, RangeRule, RequiredRule, StringLengthRule, ToolbarItemComponent, ToolbarItemLocation, VerticalAlignment } from 'devextreme/common';
import { Properties as dxBoxOptions } from 'devextreme/ui/box';
import { Properties as dxButtonOptions } from 'devextreme/ui/button';
import { User } from 'devextreme/ui/chat';
import { dxContextMenuItem } from 'devextreme/ui/context_menu';
import { DataGridPredefinedToolbarItem } from 'devextreme/ui/data_grid';
import { Command, CustomCommand } from 'devextreme/ui/diagram';
import { ItemClickEvent } from 'devextreme/ui/drop_down_button';
import { dxFileManagerContextMenuItem, FileManagerPredefinedContextMenuItem, FileManagerPredefinedToolbarItem } from 'devextreme/ui/file_manager';
import { ButtonItem, EmptyItem, FormItemComponent, FormItemType, GroupItem, LabelLocation, SimpleItem, TabbedItem } from 'devextreme/ui/form';
import { GanttPredefinedContextMenuItem, GanttPredefinedToolbarItem } from 'devextreme/ui/gantt';
import { HtmlEditorPredefinedContextMenuItem, HtmlEditorPredefinedToolbarItem } from 'devextreme/ui/html_editor';
import { dxMenuItem } from 'devextreme/ui/menu';
import { Properties as dxSplitterOptions } from 'devextreme/ui/splitter';
import { Properties as dxTabPanelOptions } from 'devextreme/ui/tab_panel';
import { LocateInMenuMode, ShowTextMode } from 'devextreme/ui/toolbar';
import { TreeListPredefinedToolbarItem } from 'devextreme/ui/tree_list';
import { dxTreeViewItem } from 'devextreme/ui/tree_view';

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

    get stylingMode(): ButtonStyle {
        return this._getOption('stylingMode');
    }
    set stylingMode(value: ButtonStyle) {
        this._setOption('stylingMode', value);
    }

    get type(): ButtonType {
        return this._getOption('type');
    }
    set type(value: ButtonType) {
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

    get author(): User | undefined {
        return this._getOption('author');
    }
    set author(value: User | undefined) {
        this._setOption('author', value);
    }

    get timestamp(): Date | number | string | undefined {
        return this._getOption('timestamp');
    }
    set timestamp(value: Date | number | string | undefined) {
        this._setOption('timestamp', value);
    }

    get typing(): boolean {
        return this._getOption('typing');
    }
    set typing(value: boolean) {
        this._setOption('typing', value);
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

    get items(): Array<dxContextMenuItem | SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem | CustomCommand | Command | dxFileManagerContextMenuItem | HtmlEditorPredefinedContextMenuItem | any | dxMenuItem | dxTreeViewItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxContextMenuItem | SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem | CustomCommand | Command | dxFileManagerContextMenuItem | HtmlEditorPredefinedContextMenuItem | any | dxMenuItem | dxTreeViewItem>) {
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

    get editorType(): FormItemComponent {
        return this._getOption('editorType');
    }
    set editorType(value: FormItemComponent) {
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

    get itemType(): FormItemType {
        return this._getOption('itemType');
    }
    set itemType(value: FormItemType) {
        this._setOption('itemType', value);
    }

    get label(): { alignment?: HorizontalAlignment, location?: LabelLocation, showColon?: boolean, template?: any, text?: string | undefined, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { alignment?: HorizontalAlignment, location?: LabelLocation, showColon?: boolean, template?: any, text?: string | undefined, visible?: boolean }) {
        this._setOption('label', value);
    }

    get name(): string | undefined | DataGridPredefinedToolbarItem | Command | FileManagerPredefinedContextMenuItem | FileManagerPredefinedToolbarItem | GanttPredefinedContextMenuItem | GanttPredefinedToolbarItem | HtmlEditorPredefinedContextMenuItem | HtmlEditorPredefinedToolbarItem | TreeListPredefinedToolbarItem {
        return this._getOption('name');
    }
    set name(value: string | undefined | DataGridPredefinedToolbarItem | Command | FileManagerPredefinedContextMenuItem | FileManagerPredefinedToolbarItem | GanttPredefinedContextMenuItem | GanttPredefinedToolbarItem | HtmlEditorPredefinedContextMenuItem | HtmlEditorPredefinedToolbarItem | TreeListPredefinedToolbarItem) {
        this._setOption('name', value);
    }

    get validationRules(): Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule> {
        return this._getOption('validationRules');
    }
    set validationRules(value: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>) {
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

    get captionTemplate(): any {
        return this._getOption('captionTemplate');
    }
    set captionTemplate(value: any) {
        this._setOption('captionTemplate', value);
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

    get tabs(): Array<any | { alignItemLabels?: boolean, badge?: string | undefined, colCount?: number, colCountByScreen?: { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined }, disabled?: boolean, icon?: string | undefined, items?: Array<SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem>, tabTemplate?: any | undefined, template?: any | undefined, title?: string | undefined }> {
        return this._getOption('tabs');
    }
    set tabs(value: Array<any | { alignItemLabels?: boolean, badge?: string | undefined, colCount?: number, colCountByScreen?: { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined }, disabled?: boolean, icon?: string | undefined, items?: Array<SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem>, tabTemplate?: any | undefined, template?: any | undefined, title?: string | undefined }>) {
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

    get horizontalAlignment(): HorizontalAlignment {
        return this._getOption('horizontalAlignment');
    }
    set horizontalAlignment(value: HorizontalAlignment) {
        this._setOption('horizontalAlignment', value);
    }

    get verticalAlignment(): VerticalAlignment {
        return this._getOption('verticalAlignment');
    }
    set verticalAlignment(value: VerticalAlignment) {
        this._setOption('verticalAlignment', value);
    }

    get locateInMenu(): LocateInMenuMode {
        return this._getOption('locateInMenu');
    }
    set locateInMenu(value: LocateInMenuMode) {
        this._setOption('locateInMenu', value);
    }

    get location(): ToolbarItemLocation | Array<any | { col?: number, colspan?: number | undefined, row?: number, rowspan?: number | undefined, screen?: string | undefined }> {
        return this._getOption('location');
    }
    set location(value: ToolbarItemLocation | Array<any | { col?: number, colspan?: number | undefined, row?: number, rowspan?: number | undefined, screen?: string | undefined }>) {
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

    get showText(): ShowTextMode {
        return this._getOption('showText');
    }
    set showText(value: ShowTextMode) {
        this._setOption('showText', value);
    }

    get widget(): ToolbarItemComponent {
        return this._getOption('widget');
    }
    set widget(value: ToolbarItemComponent) {
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

    get formatName(): HtmlEditorPredefinedToolbarItem | string {
        return this._getOption('formatName');
    }
    set formatName(value: HtmlEditorPredefinedToolbarItem | string) {
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

    get collapsed(): boolean {
        return this._getOption('collapsed');
    }
    set collapsed(value: boolean) {
        this._setOption('collapsed', value);
    }

    get collapsedSize(): number | string | undefined {
        return this._getOption('collapsedSize');
    }
    set collapsedSize(value: number | string | undefined) {
        this._setOption('collapsedSize', value);
    }

    get collapsible(): boolean {
        return this._getOption('collapsible');
    }
    set collapsible(value: boolean) {
        this._setOption('collapsible', value);
    }

    get maxSize(): number | string | undefined {
        return this._getOption('maxSize');
    }
    set maxSize(value: number | string | undefined) {
        this._setOption('maxSize', value);
    }

    get minSize(): number | string | undefined {
        return this._getOption('minSize');
    }
    set minSize(value: number | string | undefined) {
        this._setOption('minSize', value);
    }

    get resizable(): boolean {
        return this._getOption('resizable');
    }
    set resizable(value: boolean) {
        this._setOption('resizable', value);
    }

    get size(): number | string | undefined {
        return this._getOption('size');
    }
    set size(value: number | string | undefined) {
        this._setOption('size', value);
    }

    get splitter(): dxSplitterOptions | undefined {
        return this._getOption('splitter');
    }
    set splitter(value: dxSplitterOptions | undefined) {
        this._setOption('splitter', value);
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
