import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProd = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const params = useParams();
  useEffect(() => {
    // here i used below condition if i not click update button in product list and come at this page and refresh it then
    // it can't connect with backend so i have used below condition
    if (params.id == ":id") {
      alert(
        `You can't update any product directly here, go to home page select a product to click update and now you'll there get the product id and now you can update`      );
      return;
    }

    // if(!name){return}
    getProductDetails();
  }, []);
  const getProductDetails = async () => {
    let result = await fetch(`http://localhost:1000/product/${params.id}`, {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    // if (name != result.name) {
    //   return;
    // }
    setName(result.name);
    setPrice(result.price);
    setCategory(result.category);
    setCompany(result.company);
  };
  const handleName = (event) => {
    const name = event.target.value;
    setName(name);
  };
  const handlePrice = (event) => {
    const price = event.target.value;
    setPrice(price);
  };
  const handleCategory = (event) => {
    const category = event.target.value;
    setCategory(category);
  };
  const handleCompany = (event) => {
    const company = event.target.value;
    setCompany(company);
  };
  const updateProduct = async () => {
    // this below line condition is compulsory as if i open this page by default then click update button then it
    // gives error as he could not connect to backend and match our id as we are not updating we are just using this page
    // so this error happens and below is the solution of above thing
    console.log(`before usman`);
    if (params.id == ":id") {
      alert(
        `You can't update any product directly here, go to home page select a product to click update and now you'll there get the product id and now you can update`
      );
      return;
    }
    let result = await fetch(`http://localhost:1000/product/${params.id}`, {
      method: "Put",
      body: JSON.stringify({ name, price, category, company }),
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    console.log(`afterrrr usman`);
    result = await result.json();
    console.log(`tahir`);
    navigate("/");
    console.log(`khalil`);
  };
  return (
    <div className="product ">
      <h1>Update Product</h1>
      <input
        type="text"
        value={name}
        onChange={handleName}
        placeholder="Enter Product Name"
        className="inputBox"
      />
      <input
        type="text"
        value={price}
        onChange={handlePrice}
        placeholder="Enter Product Price"
        className="inputBox"
      />
      <input
        type="text"
        value={category}
        onChange={handleCategory}
        placeholder="Enter Product Category"
        className="inputBox"
      />
      <input
        type="text"
        value={company}
        onChange={handleCompany}
        placeholder="Enter Product Company"
        className="inputBox"
      />
      <button type="button" onClick={updateProduct} className="appButton ">
        update Product
      </button>
      <div id="added-product-message"></div>
    </div>
  );
};

export default UpdateProd;
