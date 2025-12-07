import React, { useContext } from 'react'
import star_icon from '../../assets/star_icon.png'
import star_dull_icon from '../../assets/star_dull_icon.png'
import { ShopContext } from '../../context/ShopContext';
import '../ProductDisplay/ProductDisplay.css'

function ProductDisplay(props) {

    const {product} = props;
    const {addToCart} = useContext(ShopContext)
  return (
    <div className='productDisplay'>
        <div className="productDisplay-left">
            <div className='productDisplay-list'>
                <img src={product.image_url} alt="" />
                <img src={product.image_url} alt="" />
                <img src={product.image_url} alt="" />
                <img src={product.image_url} alt="" />
            </div>
            <div className="productDisplay-image">
                <img className='productDisplay-main-img' src={product.image_url} alt="" />
            </div>
        </div>
        <div className="productDisplay-right">
            <h1>{product.name}</h1>
            <div className="productDisplay-right-star">
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_icon} alt="" />
                <img src={star_dull_icon} alt="" />
                <p>(512 reviews)</p>
            </div>
            <div className="productDisplay-right-prices">
                <div className="productDisplay-right-oldprice">${product.old_price}</div>
                <div className="productDisplay-right-newprice">${product.new_price}</div>
            </div>
            <div className="productDisplay-right-description">
                Upgrade your everyday look with this stylish green full-zip hoodie, designed for comfort, versatility, and a modern athletic vibe. Made from soft, durable fabric, it features a classic hooded design, an adjustable drawstring, and a smooth zipper closure.
            </div>
            <div className="productDisplay-right-size">
                <h1>Select Size</h1>
                <div className="productDisplay-right-size">
                    <div>S</div>
                    <div>M</div>
                    <div>L</div>
                    <div>XL</div>
                    <div>XXl</div>
                </div>
            </div>
            <button onClick={() => {addToCart(product.id)}}>ADD TO CART</button>
            <p className='productDisplay-right-category'><span>Category :</span></p> Women, T-Shirt, Crop Top
            <p className='productDisplay-right-category'><span>Tags :</span></p> Modern, Latest
        </div>
    </div>
  )
}

export default ProductDisplay
