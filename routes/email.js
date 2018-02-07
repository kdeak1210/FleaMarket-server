import express from 'express';
import sgMail from '@sendgrid/mail';

const router = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/send', (req, res) => {
  const {
    buyer, item, message,
  } = req.body;

  const { username: buyerUsername, email: buyerEmail } = buyer;
  const { seller, name: itemName, price } = item;
  const { username: sellerName, email: sellerEmail } = seller;

  const msg = {
    to: sellerEmail,
    from: buyerEmail,
    subject: `ReactFleaMarket - ${buyerUsername} is interested in your listing!`,
    html: `Hello ${sellerName}! <i>${buyerUsername}</i> has responded to your listing: <strong>${itemName} for $${price}</strong><br>
          <br>Here is their message: <br><pre>${message}</pre><br>
          You can reply to <i>${buyerUsername}</i> by email: <a href="mailto:${buyerEmail}?Subject=FleaMarket">${buyerEmail}</a>`,
  };
  sgMail.send(msg)
    .then(() => {
      res.json({
        confirmation: 'success',
        message: `Email successfully sent to ${sellerName}!`,
      });
    })
    .catch((err) => {
      res.json({
        confirmation: 'fail',
        message: err.message,
      });
    });

  // { buyer:
  //   { id: '5a78c8431dc6092f1a398c43',
  //     username: 'kyle',
  //     email: 'kyle@email.com' },
  //  item:
  //   { name: 'cathedral',
  //     price: 123,
  //     image: 'https://react-flea-market.s3.us-east-2.amazonaws.com/cathedral.jpeg',
  //     seller: { id: '5a79512b8461136677cd0aa7', username: 'dtrump', image: '' },
  //     geo: [ 38.9, -77.04 ],
  //     timestamp: '2018-02-06T21:52:33.621Z',
  //     id: '5a7a23a1cbd5f41558cd6438' },
  //  message: 'yooo',
  //  timestamp: '2018-02-07T04:06:06.930Z',
  //  id: '5a7a7b2ec883bd5b26f52540' }
});

export default router;
