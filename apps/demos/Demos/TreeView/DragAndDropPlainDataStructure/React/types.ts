export interface FileSystemItem {
  id: string;
  parentId?: string;
  name: string;
  icon: string;
  isDirectory: boolean;
  expanded?: boolean;
}
