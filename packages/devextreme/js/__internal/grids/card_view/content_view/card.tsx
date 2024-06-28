import {Component} from 'inferno'

export const CLASSES = {
  card: 'dx-cardview-card'
}

export interface CardProps {
  index: number;
}

export class Card extends Component<CardProps> {
  render() {
    return <div className={CLASSES.card}>
      {this.props.index}
    </div>
  }
}