// Simple state management without Redux
export const createStore = () => {
  let state = {
    user: null,
    articles: [],
    selectedTag: null
  };
  
  const listeners = [];
  
  const getState = () => state;
  
  const setState = (newState) => {
    state = { ...state, ...newState };
    listeners.forEach(listener => listener(state));
  };
  
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  };
  
  return { getState, setState, subscribe };
};

export const store = createStore();