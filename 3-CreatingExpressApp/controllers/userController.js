const express = require("express");
const User = require("../models/user");
const UserVerification = require("../models/userVerification");
const PasswordReset = require("../models/passwordReset");
// email handler
const nodemailer = require("nodemailer");

// unique string
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

//node mailer stuff
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

// testing email is working or not
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("ready for messages");
    console.log(success);
  }
});
//password bycrypt
const bcrypt = require("bcrypt");
//list
const userIndex = (req, res) => {
  User.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.json({
        status: 201,
        message: "User list",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
// send verification email
const sendVerificationEmail = ({ _id, email }, res) => {
  // url to be used in the email
  const currentUrl = "http://localhost:3000/";
  const uniqueString = uuidv4() + _id;

  // mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email ",
    html: `<p>Verify your email address to complete the signup and login into your account.</p>
        <p>This link <b>expires in 6 hours.</b></p>
        <p>Press Here <a href="${currentUrl}users/verify/${_id}/${uniqueString}">Click here to verify your account</a>
        to proceed.</p>`,
  };

  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniquedString) => {
      const newUserVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniquedString,
      });

      newUserVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              res.json({
                status: "pending",
                message: " Verification email sent ",
              });
            })
            .catch(() => {
              res.json({
                status: 404,
                message: "Verification email failed.",
              });
            });
        })
        .catch((error) => {
          res.json({
            status: 404,
            message: "An error occured while verificating the user ",
          });
        });
    })
    .catch(() => {
      res.json({
        status: 404,
        message: "An error occured while hashing the unique string",
      });
    });
};

// verify email
const verifyEmail = async (req, res) => {
  let { userId, uniqueString } = req.params;
  UserVerification.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        const { expiresAt } = result[0];
        const hashedUniquedString = result[0].uniqueString;
        if (expiresAt < Date.now()) {
          // record has expired so we delete it
          UserVerification.deleteOne({ userId })
            .then((result) => {
              User.deleteOne({ _id: userId })
                .then(() => {
                  res.json({
                    message: "link has expired",
                  });
                })
                .catch((err) => {
                  res.json({
                    status: 404,
                    message: "cannot delete User",
                  });
                });
            })
            .catch((error) => {
              res.json({
                status: 400,
                message: "cannot delete user verifacation",
              });
            });
        } else {
          bcrypt
            .compare(uniqueString, hashedUniquedString)
            .then((isMatch) => {
              if (isMatch) {
                // string match so update the verification
                User.updateOne({ _id: userId }, { verified: true }).then(() => {
                  UserVerification.deleteOne({ userId }).then(() => {
                    res.json({
                      status: 200,
                      message: " Verification update successful ",
                    });
                  });
                });
              }
            })
            .catch((err) => {
              res.json({
                satus: 400,
                message: "string does not match",
              });
            });
        }
      } else {
        res.json({
          status: 404,
          message: "Account record does not exist. Please sign up or log in . ",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 404,
        message: "user verification failed.",
      });
    });
};

// sign-up
const userSignUp = async (req, res) => {
  let { username, email, password, phone } = req.body;
  username = username.trim();
  email = email.trim();
  password = password.trim();
  phone = phone.trim();

  if (username == "" || email == "" || password == "" || phone == "") {
    res.json({
      status: 404,
      message: "Empty Input field",
    });
  } else if (!/^[a-zA-Z]*$/.test(username)) {
    res.json({
      status: 404,
      message: "Invalid name entered",
    });
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    res.json({
      status: 404,
      message: "Invalid email format",
    });
  } else if (phone.length < 8) {
    res.json({
      status: 404,
      message: "Phone number length must be at least  8 digits",
    });
  } else if (password.length < 8) {
    res.json({
      status: 404,
      message: "Password length must be at least 8 characters long",
    });
  } else {
    try {
      const result = await User.find({ email: email });
      if (result.length) {
        res.json({
          status: 403,
          message: " User with this email already exists ",
        });
      } else {
        // create user and save it to the database
        const saltRounds = 10;
        bcrypt
          .hash(password, saltRounds)
          .then((hashedPassword) => {
            const newUser = new User({
              username: username,
              email: email,
              password: hashedPassword,
              phone: phone,
              verified: false,
            });
            newUser.save().then((result) => {
              sendVerificationEmail(result, res);
            });
          })
          .catch((err) => {
            res.json({
              status: 404,
              message: "An error occured while saving user account",
            });
          });
      }
    } catch (err) {
      res.json({
        status: 200,
        message: " An error occured while checking for existing user ",
      });
      return err;
    }
  }
};

const userLogIn = async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (email == "" || password == "") {
    res.json({
      status: 404,
      message: "Empty credentials supplied",
    });
  } else {
    const result = await User.find({ email });
    if (result.length) {
      if (!result[0].verified) {
        res.json({
          status: 404,
          message:
            " Email has not been verified yet. Check out your email inbox ",
        });
      } else {
        const hashedPassword = result[0].password;
        const isPassword = await bcrypt.compare(password, hashedPassword);
        if (isPassword) {
          res.json({
            status: 200,
            message: "Signin successful",
            data: result,
          });
        } else {
          res.json({
            status: 404,
            message: "Sign in Fail. Invalid Password Entered :(",
          });
        }
      }
    }
  }
};

// request password reset
const requestPasswordReset = async (req, res) => {
  const { email, redirectUrl } = req.body;

  try {
    const results = await User.find({ email }); // will return the array
    if (results.length > 0) {
      //check if the user is verified ?
      if (!results[0].verified) {
        return res.json({
          message: ` Email has not been verified yet `,
          error: error,
        });
      } else {
        // send user email to reset the password
        sendResetEmail(results[0], redirectUrl, res);
      }
    } else {
      return res.json({
        message: `User with email ${email} does not exist :(`,
        error: error,
      });
    }
  } catch (err) {
    return res.json({
      message: `Cannot find the user with ${email}`,
      error: err,
    });
  }
};

// send password reset email
const sendResetEmail = async ({ _id, email }, redirectUrl, res) => {
  const resetString = uuidv4() + _id;
  //first clear all the existing password reset records
  await PasswordReset.deleteMany({ userId: _id });

  // mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: " Forget Password ",
    html: `<p> Reset your password </p>
        <p>This link <b>expires in 60 minutes .</b></p>
        <p>Press Here <a href="${redirectUrl}/${_id}/${resetString}">Click here to reset your password</a>
        to proceed.</p>`,
  };

  // hash the reset string

  const saltRounds = 10;
  bcrypt
    .hash(resetString, saltRounds)
    .then((hashedResetString) => {
      const newPasswordReset = new PasswordReset({
        userId: _id,
        resetString: hashedResetString,
      });
      newPasswordReset
        .save()
        .then((result) => {
          transporter.sendMail(mailOptions);
          return res.json({
            status: "pending",
            message: " Password  reset instructions have been sent!",
          });
        })
        .catch((err) => {
          res.json({
            message:
              " Cannot send the password reset instructions to the email ",
            status: 404,
          });
        });
    })
    .catch((err) => {
      res.json({
        message: "error occured while hasing the reset string",
        status: 404,
      });
    });
};

// reset password
const resetPassword = async (req, res) => {
  let { userId, resetString, newPassword, confirmPassword } = req.body;
  confirmPassword = confirmPassword.trim();

  if (confirmPassword.length < 8) {
    res.json({
      status: 404,
      message: "Password length must be at least 8 characters long",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.json({
      status: 404,
      message: "New password and confirm password does not match :(",
    });
  }

  PasswordReset.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        const createdAtDate = new Date(result[0].createdAt);
        const hashedResetString = result[0].resetString;
        const timeDifferenceInMilliseconds =
          Date.now() - createdAtDate.getTime();
        // Convert milliseconds to minutes
        const timeDifferenceInMinutes =
          timeDifferenceInMilliseconds / (1000 * 60);
        if (timeDifferenceInMinutes < 60) {
          bcrypt
            .compare(resetString, hashedResetString)
            .then((result) => {
              if (result) {
                // string match
                // hash password again
                const saltRounds = 10;
                bcrypt
                  .hash(confirmPassword, saltRounds)
                  .then((hashedPassword) => {
                    User.findByIdAndUpdate(userId, {
                      password: hashedPassword,
                    }).then(() => {
                      PasswordReset.deleteOne({ userId }).then(() =>
                        res.json({
                          status: 200,
                          message: "User password updated successfully :) ",
                        })
                      );
                    });
                  })
                  .catch((err) => {
                    res.json({
                      status: 404,
                      message: "An error occured while hasing the password :(",
                    });
                  });
              } else {
                res.json({
                  status: 404,
                  message: "Incorrect string passed ! ",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: 404,
                message: "comparing reset string and hashrest string failed",
              });
            });
        } else {
          PasswordReset.deleteOne({ userId })
            .then(() => {})
            .catch((err) => {
              res.json({
                status: 404,
                message:
                  " An error occured while clearing the password record ",
              });
            });
          res.json({
            status: 404,
            message: " Link has exipred since it has exipred 60 minutes ",
          });
        }
      } else {
        res.json({
          status: 404,
          message: " There is no user found in the password reset record ",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 404,
        message: "cannot find the user in the password record ",
      });
    });
};

module.exports = {
  userIndex,
  userSignUp,
  userLogIn,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
};
