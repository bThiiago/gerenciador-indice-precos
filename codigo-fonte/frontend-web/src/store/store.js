// store/store.js

import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./reducers/themeSlice";

export const store = configureStore({
  reducer: {
    theme: themeSlice,
  },
});
