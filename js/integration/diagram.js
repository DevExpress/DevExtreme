import {
    AutoZoomMode,
    Browser,
    ConnectorLineEnding,
    ConnectorLineOption,
    DataLayoutOrientation,
    DataLayoutType,
    DiagramCommand,
    DiagramControl,
    DiagramLocalizationService,
    DiagramUnit,
    EventDispatcher,
    ShapeTypes,
    NativeShape
} from 'devexpress-diagram';
import { addLibrary } from '../core/registry';

const isAllPartsImported = AutoZoomMode && Browser && ConnectorLineEnding && ConnectorLineOption && DataLayoutOrientation &&
    DataLayoutType && DiagramCommand && DiagramControl && DiagramLocalizationService && DiagramUnit && EventDispatcher &&
    ShapeTypes && NativeShape;

isAllPartsImported && addLibrary('diagram', {
    AutoZoomMode,
    Browser,
    ConnectorLineEnding,
    ConnectorLineOption,
    DataLayoutOrientation,
    DataLayoutType,
    DiagramCommand,
    DiagramControl,
    DiagramLocalizationService,
    DiagramUnit,
    EventDispatcher,
    ShapeTypes,
    NativeShape
});
