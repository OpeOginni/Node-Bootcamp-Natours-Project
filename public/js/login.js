/* eslint-disable */
import axios from 'axios'; // forget the error...this works
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!'); // an alert is given when user is succesfully logged in
      window.setTimeout(() => {
        location.assign('/');
      }, 1500); // User is sent to home page after 1.5 seconds
    }
  } catch (err) {
    showAlert('error', err.response.data.message); // Advice to use Alert for the Project
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    if ((res.data.status = 'success')) location.reload(true); // forces reload from server
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};