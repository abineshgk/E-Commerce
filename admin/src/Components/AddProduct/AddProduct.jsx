import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_img.jpg'

function AddProduct() {
  const [productDetails, setProductDetails] = useState({
    name: "",
    old_price: "",
    new_price: "",
    category: "women",
  });
  const [image, setImage] = useState(null);

  const changeHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value,
    });
  };

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const Add_Product = async () => {
    try {
      const formData = new FormData();
      formData.append("name", productDetails.name);
      formData.append("old_price", productDetails.old_price);
      formData.append("new_price", productDetails.new_price);
      formData.append("category", productDetails.category);

      if (image) {
       
        formData.append("product", image);
      }

      const res = await fetch("http://localhost:5000/api/product", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Response:", data);

      if (data.success) {
        alert("Product Added")
        setProductDetails({
          name: "",
          old_price: "",
          new_price: "",
          category: "women",
        });
        setImage(null);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Error adding product");
    }
  };

  return (
    <div className='addproducts'>
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Title here' />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Price here' />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Offered Price here' />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='addproduct-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-upload">
        <label htmlFor="file-input">
          <img src={image?URL.createObjectURL(image):upload_area} alt="" className='addproduct-thumbnail-img' />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>
      </div>
        <button onClick={() =>{Add_Product()}} className='addproduct-btn'>ADD</button>
    </div>
  )
}

export default AddProduct
