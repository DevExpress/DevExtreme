export interface CaptionProps {
  title: string | undefined;
  template?: (title: string) => JSX.Element;
  wordWrapEnabled?: boolean;
}

export const Caption = (
  { title, template }: CaptionProps,
): JSX.Element => (template && title
  ? template(title)
  : (<span className="dx-cardview-field-name">{title}:</span>)
);
