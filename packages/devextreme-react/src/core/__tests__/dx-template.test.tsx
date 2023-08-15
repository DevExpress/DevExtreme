import { createDxTemplate } from '../dx-template';
import { TemplatesStore } from '../templates-store';

describe('dx-template', () => {
  describe('multiple rendering', () => {
    const container = {};
    const anotherContainer = {};
    const templatesStore: any = {
      add: jest.fn(),
      remove: jest.fn(),
      renderWrappers: jest.fn(),
    };

    function tryDoubleRender(model1: any, container1: any, model2: any, container2: any): void {
      const template = createDxTemplate(
        jest.fn(),
        templatesStore as TemplatesStore,
      );

      template.render({
        container: container1,
        model: model1,
      });

      template.render({
        container: container2,
        model: model2,
      });
    }

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe('is prevented if', () => {
      it('is rendered with the same model', () => {
        const model: any = {};

        tryDoubleRender(model, container, model, container);

        expect(templatesStore.add).toHaveBeenCalledTimes(2);

        const firstId = templatesStore.add.mock.calls[0][0];
        const secondId = templatesStore.add.mock.calls[1][0];
        expect(secondId).toBe(firstId);
      });

      it('is rendered with null as model', () => {
        // e.g. Lookup passes null as model if no item selected
        // https://github.com/DevExpress/devextreme-react/issues/306
        const model: any = null;

        tryDoubleRender(model, container, model, container);

        expect(templatesStore.add).toHaveBeenCalledTimes(2);

        const firstId = templatesStore.add.mock.calls[0][0];
        const secondId = templatesStore.add.mock.calls[1][0];
        expect(secondId).toBe(firstId);
      });
    });

    describe('is allowed if', () => {
      it('is rendered with different models', () => {
        // skip cases when model is undefined since no clear way of how to behave
        const model1: any = {};
        const model2: any = {};

        tryDoubleRender(model1, container, model2, container);

        expect(templatesStore.add).toHaveBeenCalledTimes(2);

        const firstId = templatesStore.add.mock.calls[0][0];
        const secondId = templatesStore.add.mock.calls[1][0];

        expect(secondId).not.toBe(firstId);
      });

      it('is rendered with undefined as model', () => {
        // skip cases when model is undefined since no clear way of how to behave
        const model: any = undefined;

        tryDoubleRender(model, container, model, container);

        expect(templatesStore.add).toHaveBeenCalledTimes(2);

        const firstId = templatesStore.add.mock.calls[0][0];
        const secondId = templatesStore.add.mock.calls[1][0];

        expect(secondId).not.toBe(firstId);
      });

      it('is rendered with same models into different containers ', () => {
        const model: any = {};

        tryDoubleRender(model, container, model, anotherContainer);

        expect(templatesStore.add).toHaveBeenCalledTimes(2);

        const firstId = templatesStore.add.mock.calls[0][0];
        const secondId = templatesStore.add.mock.calls[1][0];
        expect(secondId).not.toBe(firstId);
      });

      it('is rendered with null as model into different containers', () => {
        // e.g. Lookup passes null as model if no item selected
        const model: any = null;

        tryDoubleRender(model, container, model, anotherContainer);

        expect(templatesStore.add).toHaveBeenCalledTimes(2);

        const firstId = templatesStore.add.mock.calls[0][0];
        const secondId = templatesStore.add.mock.calls[1][0];
        expect(secondId).not.toBe(firstId);
      });
    });
  });
});
