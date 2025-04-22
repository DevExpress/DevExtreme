export type EventWithIgnore<TEvent extends Event> = TEvent & {
  dxIgnore?: boolean;
};

export type EventWithHandled<TEvent extends Event> = TEvent & {
  dxHandled?: boolean;
};

export type EventExtended<TEVent extends Event> = EventWithIgnore<TEVent>
  & EventWithHandled<TEVent>;
