import React, { useState, useEffect, useRef } from 'react';
import './CheckoutPage.css';
import ToolBar from '../../components/toolbar/toolbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import CheckoutItem from './checkoutItem/CheckoutItem';
import { useHistory } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal/ConfirmationModal';

import CardName from './textfields/CardName';
import CardNum from './textfields/CardNum';
import CardMonth from './textfields/CardMonth';
import CardYear from './textfields/CardYear';
import CardCvv from './textfields/CardCvv';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 'ch',
    },
  },
}));

export default function CheckoutPage(props) {
  const [shoppingCartItems, setShoppingCartItems] = useState([]);
  const [placeOrderClicked, setPlaceOrderClicked] = useState(false);
  const [cardNumValidated, setCardNumValidated] = useState(false);
  const [cardNameValidated, setCardNameValidated] = useState(false);
  const [cardMonthValidated, setCardMonthValidated] = useState(false);
  const [cardYearValidated, setCardYearValidated] = useState(false);
  const [cardCvvValidated, setCardCvvValidated] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const classes = useStyles();

  const history = useHistory();

  useEffect(() => {
    const getUserNotPurchasedItems = () => {
      axios({
        method: 'GET',
        url: 'http://localhost:5000/get_user_purchases',
        params: {
          save_for_later: 0,
          purchased: 0,
        },
      }).then((response) => {
        if (response.data.result !== false) {
          console.log(response);
          setShoppingCartItems(response.data.result);
        }
      });
    };
    getUserNotPurchasedItems();
  }, []);

  useEffect(() => {
    const updatePurchase = (img_id) => {
      axios({
        method: 'POST',
        url: 'http://localhost:5000/update_user_purchases_details',
        params: {
          save_for_later: 0,
          purchased: 1,
          image_id: img_id,
        },
      }).then((response) => {
        console.log(response);
        setConfirmationModalOpen(true);
      });
    };

    console.log('CALLED');
    if (
      cardNumValidated &&
      cardYearValidated &&
      cardMonthValidated &&
      cardNameValidated &&
      cardCvvValidated
    ) {
      console.log('APPROVED');
      shoppingCartItems.map((item) => {
        console.log(item.image_id);
        updatePurchase(item.image_id);
      });
    }
  }, [
    cardNumValidated,
    cardNameValidated,
    cardYearValidated,
    cardMonthValidated,
    cardCvvValidated,
  ]);

  const handlePlaceOrderButton = () => {
    setPlaceOrderClicked(!placeOrderClicked);
  };

  const handleEditButton = () => {
    history.push('/shopping-cart');
  };

  const checkoutItemsComponents = shoppingCartItems.map((item) => {
    //console.log(item);
    return (
      <CheckoutItem
        key={item.image_id}
        image_id={item.image_id}
        img={item.img}
        price={item.price}
        title={item.title}
      />
    );
  });

  return (
    <React.Fragment>
      <ToolBar />
      <div className="checkout-wrapper">
        <h1>Checkout</h1>
        <div className="checkout-grid">
          <div className="payment-info">
            <h2>Fill payment info:</h2>
            <form className={classes.root} noValidate autoComplete="off">
              <div className="cart-details-grid">
                <CardNum
                  placeOrderClicked={placeOrderClicked}
                  setCardNumValidated={setCardNumValidated}
                />
                <CardName
                  placeOrderClicked={placeOrderClicked}
                  setCardNameValidated={setCardNameValidated}
                />
                <CardMonth
                  placeOrderClicked={placeOrderClicked}
                  setCardMonthValidated={setCardMonthValidated}
                />
                <CardYear
                  placeOrderClicked={placeOrderClicked}
                  setCardYearValidated={setCardYearValidated}
                />
                <CardCvv
                  placeOrderClicked={placeOrderClicked}
                  setCardCvvValidated={setCardCvvValidated}
                />

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handlePlaceOrderButton}
                >
                  PLACE ORDER
                </Button>
              </div>
            </form>
          </div>
          <div className="purchase-info">
            <h2>
              {shoppingCartItems.length}{' '}
              {shoppingCartItems.length > 1 ? 'Items' : 'Item'}:
            </h2>
            <Button color="primary" onClick={handleEditButton}>
              Edit
            </Button>
            <div className="purchased-items">{checkoutItemsComponents}</div>
            <h2>TOTAL TO PAY: ${props.location.state.totalPrice}</h2>
          </div>
        </div>
      </div>

      {confirmationModalOpen ? <ConfirmationModal isOpen={true} /> : null}
    </React.Fragment>
  );
}
