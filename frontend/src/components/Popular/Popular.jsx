import React from 'react'
import Item from '../Item/Item'
import '../Popular/Popular.css'
import { useState } from 'react'
import { useEffect } from 'react';

function Popular() {

  const [popular_Women, setPopular_women] = useState([]);

  useEffect(() => {
      fetch("http://localhost:5000/api/popularinwomen")
      .then((response) => response.json())
      .then((data) => setPopular_women(data.products))
  },[])

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popular_Women.map((item, i) => {
            return <Item key={i} id={item.id} name={item.name} image={item.image_url} new_price={item.new_price} old_price={item.old_price}/> 
        })}
      </div>
    </div>
  )
}

export default Popular
