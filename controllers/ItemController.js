import Promise from 'bluebird';
import Item from '../models/Item';

// Export a series of functions dealing w/ CRUD operations on Item resources
export default {

  get: (params, isRaw) => new Promise((resolve, reject) => {
    // Presence of lat and lng indicates a geospatial request
    if (params.lat && params.lng) {
      const range = 92 / 6371; // (6371 radius of Earth in km)
      params.geo = {
        // $ indicates a feature of mongoose
        $near: [params.lat, params.lng],
        $maxDistance: range,
      };

      // Remove params, else query looks for posts w/ specifically these key values
      delete params.lat;
      delete params.lng;
    }

    const filters = {
      sort: { timestamp: -1 },
    };

    Item.find(params, null, filters, (err, items) => {
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
        return;
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

  destroy: (id, isRaw) => new Promise((resolve, reject) => {
    Item.findByIdAndRemove(id, (err, item) => {
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

};
