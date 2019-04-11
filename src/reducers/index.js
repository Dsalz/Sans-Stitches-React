import { combineReducers } from "redux";

// Reducers
import userReducer from "./userReducer";
import authReducer from "./authReducer";

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer
});

export default rootReducer;
