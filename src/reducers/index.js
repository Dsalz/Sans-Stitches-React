import { combineReducers } from "redux";

// Reducers
import userReducer from "./userReducer";
import authReducer from "./authReducer";
import recordReducer from "./recordReducer";

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  records: recordReducer
});

export default rootReducer;
