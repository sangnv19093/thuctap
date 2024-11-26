import { ADD_PRODUCT_TO_CART , DELETE_PRODUCT, UPDAT_CART_PRODUCT } from "./Type";


const innitialState = {
    products:[]
}

const ProductReducer = (state = innitialState , action) =>{
    switch(action.type){
            case ADD_PRODUCT_TO_CART:
                return{
                    ...state,
                    products:[...state.products , action.payload]
                }
                case DELETE_PRODUCT:
                const filterProduct = state.products.filter((product)=>product.idproductcart!==action.payload);
                return{
                    ...state , 
                    products:filterProduct
                }
                case UPDAT_CART_PRODUCT:
                    const { id, updatedData } = action.payload;
                 
                    const updatedItems = state.products.map((item) => {
                      if (item.idproductcart === id) {
                        return {
                          ...item,
                          ...updatedData,
                        };
                      }
                      return item;
                    });
                    return {
                      ...state,
                      items: updatedItems,
                    };
                default:
                    return state;
    }
}
export default ProductReducer