import mongoose from 'mongoose';

/*
id: 1,
name: 'Television',
price: 100,
image: 'https://i.amz.mshcdn.com/e9PM6xWVAGxA408GPLIBPTXaMV0=/http%3A%2F%2Fa.amz.mshcdn.com%2Fwp-content%2Fuploads%2F2015%2F01%2FBigTV.jpg',
position: { lat: 38.903, lng: -77.043 },
seller: { username: 'kyle', image: 'http://ww3.hdnux.com/photos/71/12/20/14984254/5/920x920.jpg' },
*/
const ItemSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  price: { type: Number, default: 0 },
  image: { type: String, default: '' },
  seller: { type: mongoose.SchemaTypes.Mixed, default: {} },
  position: {
    type: [Number],
    index: '2d', // supports mongoose 2d geospatial queries
  },
  timestamp: { type: Date, default: Date.now },
});

ItemSchema.methods.summary = function () {
  const summary = {
    name: this.name,
    price: this.price,
    image: this.image,
    seller: this.seller,
    position: this.position,
    timestamp: this.timestamp,
    id: this._id.toString(),
  };

  return summary;
};

export default mongoose.model('ItemSchema', ItemSchema);

