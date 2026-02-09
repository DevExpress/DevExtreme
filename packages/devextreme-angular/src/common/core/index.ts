import {
    animationPresets as animationPresetsValue,
    cancelAnimationFrame as cancelAnimationFrameValue,
    fx as fxValue,
    requestAnimationFrame as requestAnimationFrameValue,
    TransitionExecutor as TransitionExecutorValue,
} from './animation';
import type * as AnimationTypes from './animation';
import {
    getTimeZones as getTimeZonesValue,
    hideTopOverlay as hideTopOverlayValue,
    initMobileViewport as initMobileViewportValue,
} from './environment';
import type * as EnvironmentTypes from './environment';
import {
    off as offValue,
    on as onValue,
    one as oneValue,
    trigger as triggerValue,
} from './events';
import type * as EventsTypes from './events';
import {
    formatDate as formatDateValue,
    formatMessage as formatMessageValue,
    formatNumber as formatNumberValue,
    loadMessages as loadMessagesValue,
    locale as localeValue,
    parseDate as parseDateValue,
    parseNumber as parseNumberValue,
} from './localization';
import type * as LocalizationTypes from './localization';

export namespace Animation {
    export const animationPresets: typeof import('devextreme/common/core/animation').animationPresets =
        animationPresetsValue;
    export const cancelAnimationFrame: typeof import('devextreme/common/core/animation').cancelAnimationFrame =
        cancelAnimationFrameValue;
    export const fx: typeof import('devextreme/common/core/animation').fx = fxValue;
    export const requestAnimationFrame: typeof import('devextreme/common/core/animation').requestAnimationFrame =
        requestAnimationFrameValue;
    export const TransitionExecutor: typeof import('devextreme/common/core/animation').TransitionExecutor =
        TransitionExecutorValue;

    export type AnimationConfig = AnimationTypes.AnimationConfig;
    export type AnimationState = AnimationTypes.AnimationState;
    export type CollisionResolution = AnimationTypes.CollisionResolution;
    export type CollisionResolutionCombination = AnimationTypes.CollisionResolutionCombination;
    export type PositionConfig = AnimationTypes.PositionConfig;
}

export namespace Environment {
    export const getTimeZones: typeof import('devextreme/common/core/environment').getTimeZones = getTimeZonesValue;
    export const hideTopOverlay: typeof import('devextreme/common/core/environment').hideTopOverlay =
        hideTopOverlayValue;
    export const initMobileViewport: typeof import('devextreme/common/core/environment').initMobileViewport =
        initMobileViewportValue;

    export type Device = EnvironmentTypes.Device;
    export type SchedulerTimeZone = EnvironmentTypes.SchedulerTimeZone;
}

export namespace Events {
    export const off: typeof import('devextreme/common/core/events').off = offValue;
    export const on: typeof import('devextreme/common/core/events').on = onValue;
    export const one: typeof import('devextreme/common/core/events').one = oneValue;
    export const trigger: typeof import('devextreme/common/core/events').trigger = triggerValue;

    export type AsyncCancelable = EventsTypes.AsyncCancelable;
    export type Cancelable = EventsTypes.Cancelable;
    export type ChangedOptionInfo = EventsTypes.ChangedOptionInfo;
    export type EventInfo<TComponent> = EventsTypes.EventInfo<TComponent>;
    export type EventObject = EventsTypes.EventObject;
    export type InitializedEventInfo<TComponent> = EventsTypes.InitializedEventInfo<TComponent>;
    export type ItemInfo<TItemData = any> = EventsTypes.ItemInfo<TItemData>;
    export type NativeEventInfo<TComponent, TNativeEvent = Event> =
        EventsTypes.NativeEventInfo<TComponent, TNativeEvent>;
}

export namespace Localization {
    export const formatDate: typeof import('devextreme/common/core/localization').formatDate = formatDateValue;
    export const formatMessage: typeof import('devextreme/common/core/localization').formatMessage =
        formatMessageValue;
    export const formatNumber: typeof import('devextreme/common/core/localization').formatNumber = formatNumberValue;
    export const loadMessages: typeof import('devextreme/common/core/localization').loadMessages = loadMessagesValue;
    export const locale: typeof import('devextreme/common/core/localization').locale = localeValue;
    export const parseDate: typeof import('devextreme/common/core/localization').parseDate = parseDateValue;
    export const parseNumber: typeof import('devextreme/common/core/localization').parseNumber = parseNumberValue;

    export type Format = LocalizationTypes.Format;
}
