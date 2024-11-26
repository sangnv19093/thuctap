import { ADD_PRODUCT_TO_CART, DELETE_PRODUCT, UPDAT_CART_PRODUCT } from "./Type";

export const addproducttocart = (product)=>{
    return {
        type: ADD_PRODUCT_TO_CART ,
        payload: product
    }
}

export const deleteproduct = (productid)=>{
    return{
        type:DELETE_PRODUCT , 
        payload:productid
    }
}

export const updatecartproduct = (idproduct , newdata)=>{
    console.log("vào đây ok")
    return{
        type: UPDAT_CART_PRODUCT,
        payload: { idproduct, newdata},
    
    }
}