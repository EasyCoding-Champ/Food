import { createContext, useContext, useReducer } from "react";

const CartStateContext=createContext();
const CardDispatchContext=CartStateContext();
const reduceer=(state,action)=>{

}

export const CartProvider=(children)=>{
const{state,dispatch}=useReducer()
return(
<CardDispatchContext.Provider value={dispatch}>
    <CartStateContext.Provider value={state}>
        {children}
    </CartStateContext.Provider>
</CardDispatchContext.Provider>
)

}
export const useCart=()=>useContext(CartStateContext);
export const  useDispacthCart=()=>useContext(CardDispatchContext);
