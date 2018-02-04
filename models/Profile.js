import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, default: '' },
  password: { type: String, default: '' },
  email: { type: String, lowercase: true, default: '' },
  image: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now() },
});

// Obscure the password for public requests (non-account based)
ProfileSchema.methods.summary = function () {
  const summary = {
    username: this.username,
    email: this.email,
    image: this.image,
    timestamp: this.timestamp,
    id: this._id.toString(),
  };

  return summary;
};

// 'pre' middleware validates docs before save: forbid duplicate username/email
// ProfileSchema.pre('save', function(next){
//   let user = this;
//   Profile.find({$or:[{username: user.username}, {email: user.email}]}, (err, users) => {
//     if(err){
//       return next(err);
//     } else if (users.length != 0) {
//       if (_.find(users, {email: user.email})){
//         user.invalidate('email', 'email is already registered');
//         next(new Error('That email is already registered'));
//       } else if (_.find(users, { username: user.username})){
//         user.invalidate('username', 'username is already taken');
//         next( new Error('That username is already taken'));
//       }
//     } else {
//       next();
//     }
//   });
// });

const Profile = mongoose.model('ProfileSchema', ProfileSchema);

export default Profile;
