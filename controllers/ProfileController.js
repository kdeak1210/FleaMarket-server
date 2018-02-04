import Profile from '../models/Profile';
import Promise from 'bluebird';
import bcrypt from 'bcrypt';

// Export a series of functions for CRUD operations on Profile resources
export default {

  get: (params, isRaw) => new Promise((resolve, reject) => {
    Profile.find(params, (err, profiles) => {
      if (err) {
        reject(err);
        return;
      }

      if (profiles == null) {
        resolve(null);
        return;
      }

      if (isRaw) {
        resolve(profiles);
      } else {
        const list = [];
        profiles.forEach((profile) => {
          list.push(profile.summary());
        });
        resolve(list);
      }
    });
  }),

  getById: (id, isRaw) => new Promise((resolve, reject) => {
    Profile.findById(id, (err, profile) => {
      if (err) {
        reject(err);
        return;
      }

      if (profile == null) {
        resolve(null);
        return;
      }

      if (isRaw) {
        resolve(profile);
      } else {
        resolve(profile.summary());
      }
    });
  }),

  create: (params, isRaw) => new Promise((resolve, reject) => {
    // Hash the password w/ bcrypt
    if (params.password) {
      params.password = bcrypt.hash(params.password, 10);
    }

    Profile.create(params, (err, profile) => {
      if (err) {
        reject(err);
        return;
      }

      if (profile == null) {
        resolve(null);
        return;
      }

      if (isRaw) {
        resolve(profile);
      } else {
        resolve(profile.summary());
      }
    });
  }),

  // update: (id, params, isRaw) => {

  // },

  // destroy: (id, isRaw) => {

  // },

};
