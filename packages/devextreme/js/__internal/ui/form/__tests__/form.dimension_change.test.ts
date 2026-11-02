import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/form';
import Form from '@js/ui/form';
import type InternalForm from '@ts/ui/form/form';
import type LayoutManager from '@ts/ui/form/form.layout_manager';

const forms: Form[] = [];

const createForm = (options: Properties): InternalForm => {
  const $element = $('<div>').appendTo(document.body);
  const form = new Form($element.get(0) as HTMLElement, options);
  forms.push(form);

  return form as unknown as InternalForm;
};

const getLocations = (layoutManager: LayoutManager): unknown[] => {
  const { items = [] } = layoutManager._responsiveBox.option();
  return items.map((item) => item.location);
};

describe('Form', () => {
  afterEach(() => {
    forms.forEach((form) => { form.dispose(); });
    forms.length = 0;
    document.body.innerHTML = '';
  });

  describe('dimension change', () => {
    it('should restore colSpan of root items when the screen grows back (T1336951)', () => {
      let screen = 'lg';
      const form = createForm({
        colCountByScreen: {
          lg: 4, md: 2, sm: 1, xs: 1,
        },
        screenByWidth: () => screen,
        items: [
          { dataField: 'OrderID', colSpan: 4 },
          { dataField: 'OrderDate', colSpan: 2 },
          { dataField: 'CustomerName', colSpan: 1 },
          { dataField: 'CustomerID', colSpan: 1 },
          { dataField: 'ShipCity', colSpan: 2 },
          { dataField: 'ShipCountry', colSpan: 2 },
        ],
      });

      const lgLocations = [
        { row: 0, col: 0, colspan: 4 },
        { row: 1, col: 0, colspan: 2 },
        { row: 1, col: 2 },
        { row: 1, col: 3 },
        { row: 2, col: 0, colspan: 2 },
        { row: 2, col: 2, colspan: 2 },
      ];

      expect(getLocations(form._rootLayoutManager)).toEqual(lgLocations);

      screen = 'md';
      form._dimensionChanged();

      expect(getLocations(form._rootLayoutManager)).toEqual([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 2, col: 0, colspan: 2 },
        { row: 3, col: 0, colspan: 2 },
      ]);

      screen = 'lg';
      form._dimensionChanged();

      expect(getLocations(form._rootLayoutManager)).toEqual(lgLocations);
    });

    it('should restore colSpan of group items when the screen grows back (T1336951)', () => {
      let screen = 'lg';
      const form = createForm({
        screenByWidth: () => screen,
        items: [{
          itemType: 'group',
          colCountByScreen: {
            lg: 4, md: 2, sm: 1, xs: 1,
          },
          items: [
            { dataField: 'OrderID', colSpan: 4 },
            { dataField: 'OrderDate', colSpan: 2 },
            { dataField: 'CustomerName' },
            { dataField: 'CustomerID' },
          ],
        }],
      });

      const groupLayoutManager = form._cachedLayoutManagers
        .find((layoutManager) => layoutManager !== form._rootLayoutManager) as LayoutManager;
      const lgLocations = getLocations(groupLayoutManager);

      expect(lgLocations).toEqual([
        { row: 0, col: 0, colspan: 4 },
        { row: 1, col: 0, colspan: 2 },
        { row: 1, col: 2 },
        { row: 1, col: 3 },
      ]);

      screen = 'md';
      form._dimensionChanged();
      screen = 'lg';
      form._dimensionChanged();

      expect(getLocations(groupLayoutManager)).toEqual(lgLocations);
    });
  });
});
