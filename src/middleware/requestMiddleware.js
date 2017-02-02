/* eslint-disable fp/no-mutation */
import { CALL_API } from 'redux-api-middleware';
import localStorageUtils from './../utils/localStorageUtils';

const requestMiddleware = () => () => (next) => (action) => {
  if (action[CALL_API]) {
    const headers = action[CALL_API].headers = action[CALL_API].headers || {}; // eslint-disable-line
    const method = action[CALL_API].method;
    const user = localStorageUtils.getAuthenticatedUser();
    const serverAddress = localStorageUtils.getServerInfo().get('address');

    if (method === 'GET' || method === 'POST' || method === 'PUT' || method === 'DELETE') {
      headers['Content-Type'] = 'application/json';

      action[CALL_API].endpoint = `${serverAddress.replace(/\/$/, '')}/${action[CALL_API].endpoint}`; // eslint-disable-line

      if (user) {
        headers.Authorization = headers.Authorization || `JWT ${user.get('access_token')}`;
      }

      return next(action);
    }
  }

  return next(action);
};

export default requestMiddleware();
