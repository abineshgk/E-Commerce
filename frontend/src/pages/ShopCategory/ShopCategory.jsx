import React, { useContext } from 'react'
import { ShopContext } from '../../context/ShopContext'
import dropdown_icon from '../../assets/dropdown_icon.png'
import Item from '../../components/Item/Item'
import '../ShopCategory/ShopCategory.css'

function ShopCategory (props) {

  const {all_product} =useContext(ShopContext);

  return (
    <div className='shop-category'>
      <img className='shopCategory-banner' src={props.banner} alt="" />
      <div className="shop-category-indexSort">
        <p>
          <span>Showing 1-12</span> out of 36 Products
        </p>
        <div className="shopCategory-sort">
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className="shopCategory-products">
        {all_product.map((item, i) => {
          if(props.category === item.category){
            return <Item key={i} id={item.id} name={item.name} image={item.image_url} new_price={item.new_price} old_price={item.old_price}/>
          }
          else{
            return null;
          }
        })}
      </div>
      <div className="shopCategoy-loadmore">
        Explore More
      </div>
    </div>
  )
}

export default ShopCategory
