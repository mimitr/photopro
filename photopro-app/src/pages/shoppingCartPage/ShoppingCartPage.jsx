import React, { useState, useEffect } from "react";
import ToolBar from "../../components/toolbar/toolbar";
import ShoppingItem from "./shoppingItem/ShoppingItem";
import Button from "@material-ui/core/Button";
import axios from "axios";

import { Redirect } from "react-router-dom";

import "./ShoppingCartPage.css";

export default function ShoppingCart() {
  const [checkoutButtonClicked, setCheckoutButtonClicked] = useState(false);

  const [shoppingCartItems, setShoppingCartItems] = useState([]);

  const [savedLaterItems, setSavedLaterItems] = useState([]);

  const [saveForLaterButtonClicked, setSaveForLaterButtonClicked] = useState(
    false
  );

  const [moveToCartButtonClicked, setMoveToCartButtonClicked] = useState(false);

  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);

  const getUserNotPurchasedItems = () => {
    axios({
      method: "GET",
      url: "http://localhost:5000/get_user_purchases",
      params: {
        save_for_later: 0,
        purchased: 0,
      },
    }).then((response) => {
      if (response.data.result !== false) {
        console.log(response);
        setShoppingCartItems(response.data.result);
      }

      setTimeout(() => {
        getUserSavedLaterItems();
      }, 100);
    });
  };

  const getUserSavedLaterItems = () => {
    axios({
      method: "GET",
      url: "http://localhost:5000/get_user_purchases",
      params: {
        save_for_later: 1,
        purchased: 0,
      },
    }).then((response) => {
      if (response.data.result !== false) {
        console.log(response);
        if (response.data) {
          setSavedLaterItems(response.data.result);
        }
      }
    });
  };

  useEffect(() => {
    getUserNotPurchasedItems();
    setSaveForLaterButtonClicked(false);
    setDeleteButtonClicked(false);
    console.log("rerendering shopping page");
  }, [saveForLaterButtonClicked, deleteButtonClicked]);

  const handleCheckoutButton = () => {
    setCheckoutButtonClicked(true);
  };

  const shoppingItems = shoppingCartItems.map((item) => {
    //console.log(item);
    return (
      <ShoppingItem
        key={item.image_id}
        caption={item.caption}
        image_id={item.image_id}
        img={item.img}
        price={item.price}
        purchased={item.purchased}
        save_for_later={item.save_for_later}
        title={item.title}
        setSaveForLaterButtonClicked={setSaveForLaterButtonClicked}
        setDeleteButtonClicked={setDeleteButtonClicked}
      />
    );
  });

  //console.log(savedLaterItems);

  const savedLaterItemsComponents = savedLaterItems.map((item) => {
    //console.log(item);
    return (
      <ShoppingItem
        key={item.image_id}
        caption={item.caption}
        image_id={item.image_id}
        img={item.img}
        price={item.price}
        purchased={item.purchased}
        save_for_later={item.save_for_later}
        title={item.title}
        setMoveToCartButtonClicked={setMoveToCartButtonClicked}
        setDeleteButtonClicked={setDeleteButtonClicked}
      />
    );
  });

  let subTotal = 0;
  shoppingCartItems.map((item) => {
    subTotal += parseFloat(item.price);
  });

  console.log(subTotal);

  const checkoutComponent = (
    <Redirect
      push
      to={{
        pathname: `/checkout`,
        state: {
          totalPrice: `${subTotal}`,
        },
      }}
    />
  );

  console.log(shoppingItems);

  let componentsRender;
  if (checkoutButtonClicked) {
    componentsRender = checkoutComponent;
  } else {
    componentsRender = (
      <div className="shopping-cart-page">
        <div className="shopping-cart">
          <h1>My Shopping Cart</h1>
          <div className="shopping-cart-grid">
            <div className="shopping-cart-items">{shoppingItems}</div>
            <div className="shopping-cart-subtotal">
              <h2>
                Subtotal ({shoppingCartItems.length} items): ${subTotal}
              </h2>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCheckoutButton}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
        <div className="save-for-later">
          <h1>Saved for later</h1>
          <div className="shopping-cart-grid">
            <div className="shopping-cart-items">
              {savedLaterItemsComponents}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ToolBar />
      {componentsRender}
    </React.Fragment>
  );
}