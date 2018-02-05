import jwt from 'jsonwebtoken';

/**
 * Generates a jsonwebtoken from a user object.
 *
 * The token is able to store non-sensitive user data in its signature as part
 * of a payload. Use this to retrieve user data on the client without server
 * any server requests.
 *
 * @param {Object} user   User to generate a token for
 *
 * @return {Object} JSONWebToken with encoded user data
 */
export const generateToken = (user) => {
  const u = {
    username: user.username,
    id: user.id,
    email: user.email,
    image: user.image,
  };

  const token = jwt.sign(u, process.env.TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24, // expires in 24 hours
  });

  return token;
};

export const placeholder = '';
