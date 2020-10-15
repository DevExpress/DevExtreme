import applyChanges from 'devextreme/data/apply_changes';
import {
  FETCH_PENDING,
  FETCH_SUCCESS,
  FETCH_ERROR,
  SAVING_PENDING,
  SAVING_SUCCESS,
  SAVING_ERROR,
  SAVING_CANCEL,
  SET_CHANGES,
  SET_EDIT_ROW_KEY } from './actions.js';

export default function reducer(state, { type, payload }) {
  let newData;

  switch (type) {
    case SAVING_SUCCESS:
      newData = applyChanges(state.data, [payload.change], { keyExpr: 'OrderID' });

      return {
        ...state,
        data: newData,
        changes: [],
        editRowKey: null,
        isLoading: false
      };
    case SAVING_CANCEL:
      return {
        ...state,
        changes: [],
        editRowKey: null
      };
    case SET_CHANGES:
      return {
        ...state,
        changes: payload
      };
    case SET_EDIT_ROW_KEY:
      return {
        ...state,
        editRowKey: payload
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        ...payload,
        isLoading: false
      };
    case FETCH_PENDING:
    case SAVING_PENDING:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_ERROR:
    case SAVING_ERROR:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}
