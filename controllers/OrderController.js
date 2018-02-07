import Order from '../models/Order';
import Promise from 'bluebird';

// Export a series of CRUD operations on Order resources
export default {

  get: (params, isRaw) => new Promise((resolve, reject) => {
    Order.find(params, (err, orders) => {
      if (err) {
        reject(err);
        return;
      }

      if (isRaw) {
        resolve(orders);
      } else {
        const list = [];
        orders.forEach(order => list.push(order.summary()));
        resolve(list);
      }
    });
  }),

  getById: (id, isRaw) => new Promise((resolve, reject) => {
    Order.findById(id, (err, order) => {
      if (err) {
        reject(err);
        return;
      }

      if (isRaw) {
        resolve(order);
      } else {
        resolve(order.summary());
      }
    });
  }),

  create: (params, isRaw) => new Promise((resolve, reject) => {
    Order.create(params, (err, order) => {
      if (err) {
        reject(err);
        return;
      }

      if (isRaw) {
        resolve(order);
      } else {
        resolve(order.summary());
      }
    });
  }),

  // update: (id, params, isRaw) => Promise((resolve, reject) => {

  // }),

  // destroy: (id, isRaw) => Promise((resolve, reject) => {

  // }),

};

