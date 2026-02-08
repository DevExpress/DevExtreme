import { confirm } from '@js/ui/dialog';

export class ConfirmController {
  public static dependencies = [] as const;

  public confirm(message: string, title: string, showTitle: boolean): Promise<boolean> {
    return confirm(
      message,
      title,
      // @ts-expect-error wrong typing
      showTitle,
    );
  }
}
