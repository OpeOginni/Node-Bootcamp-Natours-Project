/* eslint-disable */
// updateData function
import axios from 'axios'; // forget the error...this works
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    // Here the url is to update user password if the type is password and it is to Update user details if not
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Updated Successfuly!`); // an alert is given when user's data is succesfully updated in
    }
  } catch (err) {
    showAlert('error', err.response.data.message); // Advice to use Alert for the Project
  }
};
