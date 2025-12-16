import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TActiveStore = {
  id: number;
  name: string;
  type: string;
  avatar?: string | null;
  role: "OWNER" | "STAFF";
};

interface StoreState {
  activeStore: TActiveStore | null;
}

const initialState: StoreState = {
  activeStore: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setActiveStore(state, action: PayloadAction<TActiveStore>) {
      state.activeStore = action.payload;
    },
    clearActiveStore(state) {
      state.activeStore = null;
    },
  },
});

export const { setActiveStore, clearActiveStore } = storeSlice.actions;
export default storeSlice.reducer;
