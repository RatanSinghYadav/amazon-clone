import { getProductsreducers } from "./Productsreducer";
import {combineReducers} from 'redux';


const rootreducers = combineReducers({
    getProductsdata : getProductsreducers
})



export default  rootreducers;