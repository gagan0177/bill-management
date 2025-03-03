import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./customerSlice";
import billReducer from "./billSlice";

export const store = configureStore({
  reducer: {
    customers: customerReducer,
    bills: billReducer,
  },
});
