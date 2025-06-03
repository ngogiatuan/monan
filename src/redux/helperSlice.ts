import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Step {
  id: number;
  description: string;
  image?: string;
}

interface HelperState {
  steps: Step[];
}

const initialState: HelperState = {
  steps: [],
};

const helperSlice = createSlice({
  name: 'helper',
  initialState,
  reducers: {
    setSteps(state, action: PayloadAction<Step[]>) {
      state.steps = action.payload;
    },
    addStep(state, action: PayloadAction<Step>) {
      state.steps.push(action.payload);
    },
    removeStep(state, action: PayloadAction<number>) {
      state.steps = state.steps.filter(step => step.id !== action.payload);
    },
    clearSteps(state) {
      state.steps = [];
    },
  },
});

export const {setSteps, addStep, removeStep, clearSteps} = helperSlice.actions;
export default helperSlice.reducer;
