/* eslint-disable no-undef */
const {
  Users
} = require("../models/users");
const logger = require("../utils/logger");



exports.getUsersById = async (id) => {
  logger.info('get users by id requested');
  try {
    let filter = {};
    if (id !== undefined) {
      filter._id = id;
    }
    const results = await Users.find(filter);
    logger.info('users by id returned', results);
    return results
  } catch (error) {
    logger.info('error while getting users', error)
  }
}

exports.deleteUsersById = async (id) => {
  logger.info('delete users by id requested');
  try {
    let filter = {};
    if (id !== undefined) {
      filter._id = id;
    }
    const results = await Users.findByIdAndDelete(filter);
    return results
  } catch (error) {
    logger.info('error while deleting users', error)
  }
}