import {createStore} from'redux'


import ProductReducer from './ReducerAddToCart'

const store  =createStore(ProductReducer)

export default store;