import { jest } from '@jest/globals';

interface TemplateArgs {
  model: { value: unknown };
  container: HTMLElement;
  onRendered?: () => void;
}

interface PendingTemplate {
  template: { render: (args: TemplateArgs) => void };
  renderPendingTemplates: () => void;
}

export const createPendingTemplate = (): PendingTemplate => {
  const pendingTemplates: (() => void)[] = [];

  return {
    template: {
      render({ model, container, onRendered }: TemplateArgs): void {
        pendingTemplates.push(() => {
          container.append(String(model.value));
          onRendered?.();
        });
      },
    },
    renderPendingTemplates: (): void => {
      while (pendingTemplates.length) {
        pendingTemplates.shift()?.();
        jest.runAllTimers();
      }
    },
  };
};
