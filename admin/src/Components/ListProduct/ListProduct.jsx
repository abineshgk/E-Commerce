import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cart_cross_icon.png'

function ListProduct() {

    const [allProducts, setAllProducts] = useState([]);

    const fetchInfo = async () =>{
        await fetch("http://localhost:5000/api/products")
        .then((res) => res.json())
        .then((data) =>{setAllProducts(data.products)})
    }

    useEffect(() => {
        fetchInfo();
    },[])

    const remove_product = async (id) =>{
      try {
        const res = await fetch(`http://localhost:5000/api/product/${id}`,{
          method: "DELETE",
        })

        const data = await res.json();

        if(data.success){
          setAllProducts(allProducts.filter((p) => p.id !== id));
        }
        else{
          alert("Error Deleting Product");
        }

      } catch (error) {
        console.error(error)
      }
    }

  return (
    <div className='listproduct'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
            {allProducts.map((product) => {
                return <div key={product.id}>
                <div className='listproduct-format-main listproduct-format'>
                    <img src={product.image_url} alt="" className='listproduct-product-icon' />
                    <p>{product.name}</p>
                    <p>${product.old_price}</p>
                    <p>${product.new_price}</p>
                    <p>{product.category}</p>
                    <img onClick={() =>{remove_product(product.id)}} src={cross_icon} alt="" className='listproduct-remove-icon' />
                </div>
                <hr />
                </div>
            })}
      </div>
    </div>
  )
}

export default ListProduct
