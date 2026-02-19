// CreateProduct.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct } from '../../State/Product/Action';
import TextField from '@mui/material/TextField';

const initialSizes = [
  { name: "S", quantity: 0 },
  { name: "M", quantity: 0 },
  { name: "L", quantity: 0 }
];

const CreateProduct = () => {
  const [productData, setProductData] = useState({
    imageUrl: "",
    brand: "",
    title: "",
    color: "",
    discountedPrice: 0,
    price: 0,
    discountPercent: 0,
    size: initialSizes,
    quantity: 0,
    topLavelCategory: "",
    secondLavelCategory: "",
    thirdLavelCategory: "",
    description: ""
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSizeChange = (e, index) => {
    const { name, value } = e.target;
    const sizes = [...productData.size];
    sizes[index][name] = value;
    setProductData((prevState) => ({
      ...prevState,
      size: sizes
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createProduct({ data: productData }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md font-sans mt-10">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="imageUrl" className="block mb-1 font-semibold text-gray-700">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={productData.imageUrl}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="brand" className="block mb-1 font-semibold text-gray-700">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="title" className="block mb-1 font-semibold text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={productData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label htmlFor="color" className="block mb-1 font-semibold text-gray-700">Color</label>
            <input
              type="text"
              id="color"
              name="color"
              value={productData.color}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block mb-1 font-semibold text-gray-700">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="price" className="block mb-1 font-semibold text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label htmlFor="discountedPrice" className="block mb-1 font-semibold text-gray-700">Discounted Price</label>
            <input
              type="number"
              id="discountedPrice"
              name="discountedPrice"
              value={productData.discountedPrice}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="discountPercent" className="block mb-1 font-semibold text-gray-700">Discount Percentage</label>
            <input
              type="number"
              id="discountPercent"
              name="discountPercent"
              value={productData.discountPercent}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="topLavelCategory" className="block mb-1 font-semibold text-gray-700">Top Level Category</label>
            <select
              id="topLavelCategory"
              name="topLavelCategory"
              value={productData.topLavelCategory}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Choose...</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
          <div>
            <label htmlFor="secondLavelCategory" className="block mb-1 font-semibold text-gray-700">Second Level Category</label>
            <select
              id="secondLavelCategory"
              name="secondLavelCategory"
              value={productData.secondLavelCategory}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Choose...</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="brands">Brands</option>
            </select>
          </div>
          <div>
            <label htmlFor="thirdLavelCategory" className="block mb-1 font-semibold text-gray-700">Third Level Category</label>
            <select
              id="thirdLavelCategory"
              name="thirdLavelCategory"
              value={productData.thirdLavelCategory}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Choose...</option>
              <option value="top">Tops</option>
              <option value="women_dress">Dresses</option>
              <option value="t-shirts">T-Shirts</option>
              <option value="saree">Saree</option>
              <option value="lengha_choli">Lengha Choli</option>
              <option value="mens_kurta">Mens Kurta</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="description" className="block mb-1 font-semibold text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
          ></textarea>
        </div>

        <div className="mt-6 space-y-4">
          {productData.size.map((size, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <TextField
                label="Size Name"
                name="name"
                value={size.name}
                onChange={(e) => handleSizeChange(e, index)}
                required
              />
              <TextField
                label="Quantity"
                name="quantity"
                value={size.quantity}
                onChange={(e) => handleSizeChange(e, index)}
                required
               
              />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            Add New Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
