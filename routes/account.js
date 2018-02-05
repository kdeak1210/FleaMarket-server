import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import controllers from '../controllers';
import { generateToken } from '../utils/auth';

// import { Router as router } from 'express'
const router = express.Router();

router.get('/:action', (req, res) => {
  const { action } = req.params;

  if (action === 'currentuser') {
    // Look for a token in request body / URL params
    // NOTE destructuring token here w || statement doesnt work as intended
    const token = req.body.token || req.query.token;

    if (!token) {
      return res.json({
        confirmation: 'fail',
        message: 'Must pass token',
      });
    }

    // Verify token, decoding w/ secret
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) throw err;

      // Return the user from their id in the JWT (& the token itself)
      controllers.profile
        .getById(decoded.id, false)
        .then((profile) => {
          // Optional - Can refresh the token here
          // Optional - if user is not found, don't bother returning token
          res.json({
            confirmation: 'success',
            user: profile,
            token,
          });
        })
        .catch((error) => {
          res.json({
            confirmation: 'fail',
            message: error,
          });
        });
    });
  }

  // if (action === 'logout') {
  //   // Process logout
  //   req.session.reset();
  //   res.json({
  //     confirmation: 'success',
  //     user: null,
  //   });
  // }
});

router.post('/:action', (req, res) => {
  const { action } = req.params;

  if (action === 'register') {
    controllers.profile
      .create(req.body, false)
      .then((profile) => {
        // Create a token object on the session
        const token = generateToken(profile);
        res.json({
          confirmation: 'success',
          user: profile,
          token,
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err.message,
        });
      });
  }

  if (action === 'login') {
    const candidate = req.body;

    controllers.profile
      .get({ email: candidate.email }, true)
      .then(async (results) => {
        if (results.length === 0) {
          throw new Error('User was not found'); // Sends error to catch
        }

        const profile = results[0];
        const isPasswordMatch = await bcrypt.compare(candidate.password, profile.password);
        if (!isPasswordMatch) {
          throw new Error('Incorrect Password'); // Sends error to catch
        }

        const token = generateToken(profile);
        res.json({
          confirmation: 'success',
          user: profile.summary(),
          token,
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err.message,
        });
      });
  }
});

export default router;
