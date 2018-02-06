import Promise from 'bluebird';
import Item from '../models/Item';

// Export a series of functions dealing w/ CRUD operations on Item resources
export default {

  get: (params, isRaw) => new Promise((resolve, reject) => {
    Item.find(params, (err, items) => {
      if (err) {
        reject(err);
        return;
      }

      if (isRaw) {
        resolve(items);
      } else {
        const list = [];
        items.forEach(item => list.push(item.summary()));
        resolve(list);
      }
    });
  }),

  getById: (id, isRaw) => new Promise((resolve, reject) => {
    Item.findById(id, (err, item) => {
      if (err) {
        reject(err);
        return;
      }

      if (isRaw) {
        resolve(item);
      } else {
        resolve(item.summary());
      }
    });
  }),

  create: (params, isRaw) => new Promise((resolve, reject) => {
    Item.create(params, (err, item) => {
      if (err) {
        reject(err);
      }

      if (isRaw) {
        resolve(item);
      } else {
        resolve(item.summary());
      }
    });
  }),

  // update: (id, params, isRaw) => {

  // },

  // destroy: (id, isRaw) => {

  // },

};
