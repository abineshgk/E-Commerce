import React, { useContext, useState } from 'react'
import all_product from '../../assets/all_product'
import { ShopContext } from '../../context/ShopContext'
import remove_icon from '../../assets/cart_cross_icon.png'
import '../CartItems/CartItems.css'

function CartItems() {

    const {getTotalCartAmount, all_product, cartItems, removeFromCart} = useContext(ShopContext);

  return (
    <div className='cartitems'>
      <div className="cartitem-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
        {all_product.map((e) => {
            if(cartItems[e.id] > 0){
                return  <div key={e.id}>
        <div className="cartitems-format">
            <img src={e.image_url} alt="" className='carticon-product-icon' />
            <p className='cartitems-format-title'>{e.name}</p>
            <p>${e.new_price}</p>
            <p className='cartitems-quantity'>{cartItems[e.id]}</p>
            <p>{e.new_price * cartItems[e.id]}</p>
            <img src={remove_icon} onClick={() =>{removeFromCart(e.id)}} alt="" />
        </div>
        <hr />
      </div>
            }
            return null;
        })}
        <div className="cartitems-down">
            <div className="cartitems-total">
                <h1>Cart Total</h1>
                <div>
                    <div className="cartitems-total-item">
                        <p>Sub-Total</p>
                        <p>${getTotalCartAmount()}</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <p>Shipping Fee</p>
                        <p>Free</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <h3>Total</h3>
                        <h3>${getTotalCartAmount()}</h3>
                    </div>
                </div>
                <button>PROCEED TO CHECKOUT</button>
            </div>
            <div className="cartitems-promocode">
                <p>if you have a promocode, Enter it here</p>
                <div className="cartitems-promobox">
                    <input type="text" placeholder='Promo Code' />
                    <button>Submit</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CartItems
