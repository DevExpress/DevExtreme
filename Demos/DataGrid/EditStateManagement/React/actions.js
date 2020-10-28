import { sendRequest } from './utils.js';

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

export async function loadOrders(dispatch) {
  dispatch({ type: FETCH_PENDING });

  try {
    const { data } = await sendRequest(`${URL}/Orders?skip=700`);

    dispatch({
      type: FETCH_SUCCESS,
      payload: {
        data: data
      }
    });
  } catch(err) {
    dispatch({ type: FETCH_ERROR });
    throw err;
  }
}

export async function saveChange(dispatch, change) {
  if (change && change.type) {
    let data;

    dispatch({ type: SAVING_PENDING });

    try {
      data = await sendChange(URL, change);

      change.data = data;
      dispatch({
        type: SAVING_SUCCESS,
        payload: {
          change: change
        }
      });

      return data;
    } catch(err) {
      dispatch({ type: SAVING_ERROR });
      throw err;
    }
  } else {
    dispatch({ type: SAVING_CANCEL });
  }
}

async function sendChange(url, change) {
  switch (change.type) {
    case 'insert':
      return sendRequest(`${url}/InsertOrder`, 'POST', {
        values: JSON.stringify(change.data)
      });
    case 'update':
      return sendRequest(`${url}/UpdateOrder`, 'PUT', {
        key: change.key,
        values: JSON.stringify(change.data)
      });
    case 'remove':
      return sendRequest(`${url}/DeleteOrder`, 'DELETE', { key: change.key });
    default:
      break;
  }
}

export function setChanges(dispatch, changes) {
  dispatch({
    type: SET_CHANGES,
    payload: changes
  });
}

export function setEditRowKey(dispatch, editRowKey) {
  dispatch({
    type: SET_EDIT_ROW_KEY,
    payload: editRowKey
  });
}
