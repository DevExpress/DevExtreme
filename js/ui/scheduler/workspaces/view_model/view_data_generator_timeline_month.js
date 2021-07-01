import { ViewDataGenerator } from './view_data_generator';
import { calculateCellIndex } from '../utils/month';

export class ViewDataGeneratorTimelineMonth extends ViewDataGenerator {
    _calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount) {
        return calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount);
    }
}
