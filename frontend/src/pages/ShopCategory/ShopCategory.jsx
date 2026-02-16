import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/ShopContext'
import Item from '../../components/Item/Item'
import '../ShopCategory/ShopCategory.css'

function ShopCategory (props) {

  const {all_product} =useContext(ShopContext);
  const [sortOption, setSortOption] = useState("newest");

  const sortProducts = (products, sortOption) => {
    const sorted = [...products]

    if(sortOption === "price_asc"){
      sorted.sort((a, b) => a.new_price - b.new_price)
    }
    else if(sortOption === "price_desc"){
      sorted.sort((a, b) => b.new_price - a.new_price)
    }
    else if(sortOption === "alpha_asc"){
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    }
    else if(sortOption === "alpha_desc"){
      sorted.sort((a, b) => b.name.localeCompare(a.name))
    }
    return sorted
  }

  return (
    <div className='shop-category'>
      <img className='shopCategory-banner' src={props.banner} alt="" />
      <div className="shop-category-indexSort">
        <p>
          <span>Showing 1-12</span> out of 36 Products
        </p>
        <div className="shopCategory-sort">
          <label>Sort by: </label>
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="alpha_asc">Name: A - Z </option>
            <option value="alpha_desc">Name: Z - A</option>
          </select>
        </div>
      </div>
      <div className="shopCategory-products">
        {sortProducts(all_product, sortOption).map((item, i) => {
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
