export interface FileSystemItem {
  id: string;
  name: string;
  icon: string;
  isDirectory: boolean;
  items?: FileSystemItem[];
  expanded?: boolean;
}
