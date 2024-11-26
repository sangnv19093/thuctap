import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // AsyncStorage cho React Native hoặc LocalStorage cho ứng dụng web

// Khai báo reducer chính của bạn
const rootReducer = (state = {}, action) => {
  switch (action.type) {
    // Các action khác của ứng dụng
    default:
      return state;
  }
};

// Cấu hình Redux Persist
const persistConfig = {
  key: 'root', // Khóa lưu trữ
  storage, // Trình lưu trữ
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store Redux
const store = createStore(persistedReducer);
const persistor = persistStore(store);