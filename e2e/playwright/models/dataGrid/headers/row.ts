import GridModule from '../../gridCore/module';
import HeaderCell from './cell';

export default class HeaderRow extends GridModule {
  public getHeaderCell(index: number): HeaderCell {
    return new HeaderCell(this.element, index);
  }
}
