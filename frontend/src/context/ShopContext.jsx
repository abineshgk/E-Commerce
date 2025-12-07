import React,  { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

     const getDefaultCart = () =>{
        let cart = {};
        for (let index = 0; index < 300 + 1; index++) {
            cart[index] = 0;
            
        }
        return cart;
    }


function ShopContextProvider (props) {

    const [all_product, setAll_Product] = useState([]);
    
    const [cartItems, setCartItems] = useState(getDefaultCart())

    useEffect(() => {
        fetch("http://localhost:5000/api/products")
        .then((response) => response.json())
        .then((data) => setAll_Product(data.products))
    },[])

    const loadCartFromBackend = async () => {
  const token = localStorage.getItem("auth-token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/getcart", {
      headers: {
        "auth-token": token,
      },
    });

    const data = await res.json();
    console.log("Cart data from backend:", data);

    if (!data.success) return;

    const newCart = getDefaultCart();
    data.items.forEach(item => {
      newCart[item.product_id] = item.quantity;
    });

    setCartItems(newCart);
  } catch (err) {
    console.error("Error loading cart from backend:", err);
  }
};


 useEffect(() => {
    loadCartFromBackend();
  }, []);


    
const addToCart = async (productId) => {
  const token = localStorage.getItem("auth-token");
  if (!token) {
    alert("Please login to add items to cart.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: 1,
      }),
    });

    const data = await res.json();
    console.log("addtocart response:", data);

    if (!data.success) {
      alert(data.message || data.errors || "Failed to add to cart");
      return;
    }

    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));

  } catch (err) {
    console.error("Add to cart error:", err);
    alert("Something went wrong while adding to cart");
  }
};


const removeFromCart = async (productId) => {
  const token = localStorage.getItem("auth-token");
  if (!token) {
    alert("Please login to modify cart.");
    return;
  }

 
  setCartItems((prev) => {
    const current = prev[productId] || 0;
    if (current <= 0) return prev;

    return {
      ...prev,
      [productId]: current - 1,
    };
  });

  try {
    const res = await fetch("http://localhost:5000/api/removefromcart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({ product_id: productId }),
    });

    const data = await res.json();
    console.log("removefromcart response:", data);

    if (!data.success) {
      console.warn("Backend remove failed:", data);
    
    }
  } catch (err) {
    console.error("Remove from cart error:", err);
  }
};

    const getTotalCartAmount = () =>{
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item] > 0){
                let itemInfo = all_product.find((product) => product.id === Number(item))
                totalAmount += itemInfo.new_price * cartItems[item]; 
            }
            
        }
        return totalAmount;
    }

        const getTotalCartItems =() =>{
            let totalItem = 0;
            for(const item in cartItems){
                if (cartItems[item] > 0){
                    totalItem += cartItems[item]
                }
            }
            return totalItem;
        }

   const contextValue = {loadCartFromBackend, getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart}

    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider