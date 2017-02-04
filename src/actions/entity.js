import { CALL_API } from 'redux-api-middleware';
import { API_VERSION } from './../constants/Api';
import schemaUtils from './../utils/schemaUtils';

export const LOAD_ENTITIES_START = 'LOAD_ENTITIES_START';
export const LOAD_ENTITIES_SUCCESS = 'LOAD_ENTITIES_SUCCESS';
export const LOAD_ENTITIES_FAILURE = 'LOAD_ENTITIES_FAILURE';


const fetchEntities = ({ href, type, schema, resetState }) => {
  const meta = { viewId: type, resetState };

  return {
    [CALL_API]: {
      types: [
        { type: LOAD_ENTITIES_START, meta },
        schemaUtils.getSuccessActionTypeWithSchema({
          type: LOAD_ENTITIES_SUCCESS,
          schema,
          meta,
        }),
        { type: LOAD_ENTITIES_FAILURE, meta },
      ],
      method: 'GET',
      endpoint: `${API_VERSION}${href}`,
    },
  };
};

export const loadEntities = ({ href, type, schema, resetState = true }) =>
  (dispatch) => dispatch(fetchEntities({ href, type, schema, resetState }));
