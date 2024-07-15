import { combineReducers } from 'redux';

import menu from './menu';
import userReducer from './userType';

const reducers = combineReducers({ menu, userType: userReducer });

export default reducers;
