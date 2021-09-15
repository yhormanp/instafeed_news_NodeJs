/* eslint-disable no-undef */
const jwt = require('express-jwt')
const jwt2 = require('jsonwebtoken');


const getTokenFromHeaders = (req) => {
  const {
    headers: {
      authorization
    }
  } = req;

  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    algorithms: ['sha1', 'RS256', 'HS256']
  }),
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
    algorithms: ['sha1', 'RS256', 'HS256']
  }),
  checkToken: (req, res, next) => {
    const accessToken = getTokenFromHeaders(req);
    jwt2.verify(accessToken, 'secret', (err, decoded) => {
      if (err) return res.status(401).send(err.messa || 'this endpoint requires a token');

      req.user = decoded;
      next()
    })
  },

  checkAdminRoles : (req, res, next) => {
    const {
      role
    } = req.user;
    if (role === 'Admin') {
      next()
    } else {
      res.status(401).json({
        Error: 'The user needs an Admin role'
      });
    }
  }
};

module.exports = auth;