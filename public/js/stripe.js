/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = require('stripe')(
    'pk_test_51MMfFmKkvANBnAGetsy8uMn1UG2HkjAfK1Ok03YlZN7WLsX1mSkrBVHfdYyFy0AqE1IK8ymKQcbR5tWtfKnPXyPn00AoQ14zCR'
  );

  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + charge credit card
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    // });
    window.location.replace(session.data.session.url);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
