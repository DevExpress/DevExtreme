import React from 'react';
import { sendRequest } from './utils.ts';

const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

export const FETCH_PENDING = 'FETCH_PENDING';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_ERROR = 'FETCH_ERROR';
export const SAVING_PENDING = 'SAVING_PENDING';
export const SAVING_SUCCESS = 'SAVING_SUCCESS';
export const SAVING_ERROR = 'SAVING_ERROR';
export const SAVING_CANCEL = 'SAVING_CANCEL';
export const SET_CHANGES = 'SET_CHANGES';
export const SET_EDIT_ROW_KEY = 'SET_EDIT_ROW_KEY';

type dispatchType = React.Dispatch<{ type: any, payload?: any }>;

export async function loadOrders(dispatch: dispatchType) {
  dispatch({ type: FETCH_PENDING });

  try {
    const { data } = await sendRequest(`${URL}/Orders?skip=700`);

    dispatch({
      type: FETCH_SUCCESS,
      payload: {
        data,
      },
    });
  } catch (err) {
    dispatch({ type: FETCH_ERROR });
    throw err;
  }
}

export async function saveChange(dispatch: dispatchType, change: { type: any; data: any; key: any; }) {
  if (change && change.type) {
    let data;

    dispatch({ type: SAVING_PENDING });

    try {
      data = await sendChange(URL, change);

      change.data = data;
      dispatch({
        type: SAVING_SUCCESS,
        payload: {
          change,
        },
      });

      return data;
    } catch (err) {
      dispatch({ type: SAVING_ERROR });
      throw err;
    }
  } else {
    dispatch({ type: SAVING_CANCEL });
    return null;
  }
}

async function sendChange(url: string, change: { type: any; data: any; key: any; }) {
  switch (change.type) {
    case 'insert':
      return sendRequest(`${url}/InsertOrder`, 'POST', {
        values: JSON.stringify(change.data),
      });
    case 'update':
      return sendRequest(`${url}/UpdateOrder`, 'PUT', {
        key: change.key,
        values: JSON.stringify(change.data),
      });
    case 'remove':
      return sendRequest(`${url}/DeleteOrder`, 'DELETE', { key: change.key });
    default:
      return null;
  }
}

export function setChanges(dispatch: dispatchType, changes) {
  dispatch({
    type: SET_CHANGES,
    payload: changes,
  });
}

export function setEditRowKey(dispatch: dispatchType, editRowKey) {
  dispatch({
    type: SET_EDIT_ROW_KEY,
    payload: editRowKey,
  });
}
