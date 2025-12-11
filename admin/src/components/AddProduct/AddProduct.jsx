import React, { useState, useEffect } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // for preview cleanup
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  });

  // Handle image selection
  const imageHandler = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle text inputs
  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  // Submit product
  const Add_product = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    console.log("Before upload:", productDetails);

    let responseData;
    let formData = new FormData();
    formData.append('image', image); // field must match backend "image"

    try {
      // Upload image
      const uploadResp = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      responseData = await uploadResp.json();

      if (responseData.success) {
        // update product with backend image URL
        const updatedProduct = { ...productDetails, image: responseData.image_url };
        setProductDetails(updatedProduct);

        console.log("After upload:", updatedProduct);

        // Send full product details to backend
        const productResp = await fetch('http://localhost:4000/addproduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProduct),
        });

        const result = await productResp.json();
        result.success ? alert("Product added") : alert("Failed to add product");
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      console.error("Error uploading product:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className='AddProduct'>
      <div className="addproduct-itemfields">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfields">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here.."
          />
        </div>
        <div className="addproduct-itemfields">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here.."
          />
        </div>
      </div>

      <div className="addproduct-itemfields">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfields">
        <label htmlFor="file-input">
          <img
            src={previewUrl || upload_area}
            className="addproduct-thumbnail-img"
            alt="upload preview"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>

      <button onClick={Add_product} className="addproduct-button">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
