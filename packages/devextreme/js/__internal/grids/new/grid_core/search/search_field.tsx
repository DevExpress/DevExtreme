import type { ChangeEvent, InfernoNode } from 'inferno';
import { Component } from 'inferno';

export interface SearchFieldProps {
  value?: string;
  onChange?: (v: string) => void;
}

export class SearchField extends Component<SearchFieldProps> {
  private onChange(e: ChangeEvent<HTMLInputElement>): void {
    this.props.onChange?.(e.target.value);
  }

  public render(): InfernoNode {
    return (
      <input
        value={this.props.value}
        onChange={this.onChange.bind(this)}
      />
    );
  }
}
