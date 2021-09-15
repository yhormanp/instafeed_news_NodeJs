/* eslint-disable no-undef */
const {
  Users
} = require("../models/users");



exports.getUsersById = async (id) => {
  try {
    let filter = {};
    if (id !== undefined) {
      filter._id = id;
    }
    const results = await Users.find(filter);
    return results
  } catch (error) {
    console.log('error while getting users', error)
  }
}

exports.deleteUsersById = async (id) => {
  try {
    let filter = {};
    if (id !== undefined) {
      filter._id = id;
    }
    const results = await Users.findByIdAndDelete(filter);
    return results
  } catch (error) {
    console.log('error while deleting users', error)
  }
}