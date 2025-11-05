/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWindow } from '@js/core/utils/window';
import FileUploader from '@js/ui/file_uploader';
import { getDiagram } from '@ts/ui/diagram/diagram.importer';

interface DialogParameters {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  command: any;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onGetContent: (args: any) => dxElementWrapper;
}

const DiagramDialogManager = {
  getConfigurations(): DialogParameters[] {
    const { DiagramCommand } = getDiagram();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,no-return-assign
    return (
      this.dialogList
      || (this.dialogList = [
        {
          command: DiagramCommand.InsertShapeImage,
          title: messageLocalization.format(
            'dxDiagram-dialogInsertShapeImageTitle',
          ),
          onGetContent: this.getChangeImageDialogContent,
        },
        {
          command: DiagramCommand.EditShapeImage,
          title: messageLocalization.format(
            'dxDiagram-dialogEditShapeImageTitle',
          ),
          onGetContent: this.getChangeImageDialogContent,
        },
      ])
    );
  },
  getChangeImageDialogContent(args): dxElementWrapper {
    const $uploader = $('<div>');
    args.component._createComponent($uploader, FileUploader, {
      selectButtonText: messageLocalization.format(
        'dxDiagram-dialogEditShapeImageSelectButton',
      ),
      accept: 'image/*',
      uploadMode: 'useForm',
      onValueChanged(e): void {
        const window = getWindow();
        // @ts-expect-error ts-error
        const reader = new window.FileReader();
        reader.onload = (): void => {
          args.component._commandParameter = e.target.result;
        };
        reader.readAsDataURL(e.value[0]);
      },
    });
    return $uploader;
  },
  getDialogParameters(command): DialogParameters | null {
    const commandIndex = this.getConfigurations()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .map((c) => c.command)
      .indexOf(command);
    if (commandIndex >= 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.getConfigurations()[commandIndex];
    }
    return null;
  },
};

export default DiagramDialogManager;
