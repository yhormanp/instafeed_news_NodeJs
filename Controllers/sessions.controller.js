/* eslint-disable no-undef */
const passport = require('passport');


const sessionPOST = async (req, res, next) => {
  const {
    body: {
      user
    }
  } = req;

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', {
    session: false
  }, (err, passportUser, info) => {
    if (err) {
      return next(err);
    }

    if (passportUser) {
      const user = passportUser;
      // user.token = passportUser.generateJWT();

      return res.json({
        user: user.toAuthJSON()
      });

    }
    return res.status(400).send(info);
  })(req, res, next)
}



module.exports = {
  sessionPOST
}