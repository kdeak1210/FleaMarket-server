import mongoose from 'mongoose';
/**
 * buyer
 * message
 * item (contains the seller)
 */

const OrderSchema = new mongoose.Schema({
  buyer: { type: mongoose.SchemaTypes.Mixed, default: {} },
  item: { type: mongoose.SchemaTypes.Mixed, default: {} }, // contains seller
  message: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

OrderSchema.methods.summary = function () {
  const summary = {
    buyer: this.buyer,
    item: this.item,
    message: this.message,
    timestamp: this.timestamp,
    id: this._id.toString(),
  };

  return summary;
};

export default mongoose.model('OrderSchema', OrderSchema);
