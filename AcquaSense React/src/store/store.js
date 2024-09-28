import { createStore } from 'redux';
import { searchReducer } from './reducers/searchReducer'; // Adicione o reducer

const store = createStore(searchReducer);

export default store;
