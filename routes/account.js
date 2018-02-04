import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import controllers from '../controllers';

// import { Router as router } from 'express'
const router = express.Router();

router.get('/:action', (req, res) => {
  const { action } = req.params;

  if (action === 'currentuser') {
    // Check if there is an active session
    if (req.session == null) {
      res.json({
        confirmation: 'success',
        user: null,
      });

      return;
    }

    // There is an active session - check if theres a token
    if (req.session.token == null) {
      res.json({
        confirmation: 'success',
        user: null,
      });

      return;
    }

    // Verify token, if valid send back the current user's id
    jwt.verify(req.session.token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        // Invalid token - log them out and start it over
        req.session.reset();
        res.json({
          confirmation: 'fail',
          user: null,
        });

        return;
      }

      controllers.profile
        .getById(decoded.id, false)
        .then((result) => {
          res.json({
            confirmation: 'success',
            user: result,
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

  if (action === 'logout') {
    // Process logout
    req.session.reset();
    res.json({
      confirmation: 'success',
      user: null,
    });
  }
});

router.post('/:action', (req, res) => {
  const { action } = req.params;

  if (action === 'register') {
    // Process register

    controllers.profile
      .create(req.body, false)
      .then((result) => {
      // Create a token object on the session
        const token = jwt.sign({ id: result.id }, process.env.TOKEN_SECRET, { expiresIn: 5000 });
        req.session.token = token;

        res.json({
          confirmation: 'success',
          user: result,
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
    // Process login
    const candidate = req.body;

    controllers.profile
      .get({ email: candidate.email }, true)
      .then((results) => {
        if (results.length === 0) {
          throw new Error('User was not found'); // Sends error to catch
        }
        const profile = results[0];
        const isPasswordMatch = bcrypt.compare(candidate.password, profile.password);

        if (!isPasswordMatch) {
          throw new Error('Incorrect Password'); // Sends error to catch
        }

        // Create a token object on the session
        const token = jwt.sign({ id: profile._id }, process.env.TOKEN_SECRET, { expiresIn: 5000 });
        req.session.token = token;

        res.json({
          confirmation: 'success',
          user: profile.summary(),
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
