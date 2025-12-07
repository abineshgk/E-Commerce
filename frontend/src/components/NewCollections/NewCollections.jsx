import React from 'react'
import Item from '../Item/Item'
import '../NewCollections/NewCollections.css'
import { useState } from 'react'
import { useEffect } from 'react';

function NewCollections() {

    const [new_collection, setNew_Collection] = useState([]);

    useEffect(() => {
      fetch("http://localhost:5000/api/newcollections")
      .then((response) => response.json())
      .then((data) => setNew_Collection(data.products))
    },[])

  return (
    <div className='newCollections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => {
            return <Item key={i} id={item.id} name={item.name} image={item.image_url} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default NewCollections
