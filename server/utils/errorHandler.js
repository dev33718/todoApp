const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // replace with your email
    pass: 'your-email-password' // replace with your email password
  }
});

const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err);

  const mailOptions = {
    from: 'yourapp@example.com',
    to: 'sarrafdevesh1879@gmail.com',
    subject: 'Server Error Notification',
    text: `An error occurred: ${err.message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending error notification email:', error);
    } else {
      console.log('Error notification email sent:', info.response);
    }
  });

  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;