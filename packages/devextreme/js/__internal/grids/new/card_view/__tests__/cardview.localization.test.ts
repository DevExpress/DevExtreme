/* eslint-disable i18n/no-russian-character */
import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import { formatMessage, loadMessages, locale } from '@js/localization';

import {
  afterTest,
  beforeTest,
  createCardView,
  flushAsync,
} from './__mock__/helpers/utils';

describe('CardView', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('Localization', () => {
    afterEach(() => {
      locale('en');
    });

    it('should use formatMessage for column captions', async () => {
      const dictionary = {
        en: {
          Company: 'Company',
          Address: 'Address',
        },
        ru: {
          Company: 'Компания',
          Address: 'Адрес',
        },
      };

      loadMessages(dictionary);
      locale('ru');

      const { instance } = await createCardView({
        dataSource: [
          { id: 1, company: 'Test Company', address: 'Test Address' },
        ],
        columns: [
          {
            dataField: 'company',
            caption: formatMessage('Company'),
          },
          {
            dataField: 'address',
            caption: formatMessage('Address'),
          },
        ],
      });

      const columns = instance.option('columns') as { caption?: string }[];

      expect(columns[0].caption).toBe('Компания');
      expect(columns[1].caption).toBe('Адрес');
    });

    it('should change column captions when locale changes', async () => {
      const dictionary = {
        en: {
          Company: 'Company',
        },
        de: {
          Company: 'Firma',
        },
        ru: {
          Company: 'Компания',
        },
      };

      loadMessages(dictionary);

      const { instance, component } = await createCardView({
        dataSource: [
          { id: 1, company: 'Test Company' },
        ],
        columns: [
          {
            dataField: 'company',
            caption: formatMessage('Company'),
          },
        ],
      });

      let columns = instance.option('columns') as { caption?: string }[];
      expect(columns[0].caption).toBe('Company');

      locale('de');
      component.apiOption('columns', [
        {
          dataField: 'company',
          caption: formatMessage('Company'),
        },
      ]);

      columns = instance.option('columns') as { caption?: string }[];
      expect(columns[0].caption).toBe('Firma');

      locale('ru');
      component.apiOption('columns', [
        {
          dataField: 'company',
          caption: formatMessage('Company'),
        },
      ]);

      columns = instance.option('columns') as { caption?: string }[];
      expect(columns[0].caption).toBe('Компания');
    });

    it('should localize columnChooser title', async () => {
      locale('ru');

      const { instance, component } = await createCardView({
        dataSource: [
          { id: 1, name: 'Test' },
        ],
        columns: ['id', 'name'],
        columnChooser: {
          enabled: true,
          mode: 'select',
        },
      });

      instance.showColumnChooser();

      await flushAsync();

      const columnChooser = component.getColumnChooser();

      expect(columnChooser.isVisible()).toBe(true);
      expect(columnChooser.getTitle()).toBe('Выбор столбцов');
    });
  });
});
