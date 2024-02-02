const User = require("../models/user")
const config = require("../config.js")
const jwt = require("jwt-simple");
exports.login = function (req, res) {
    User.findOne({ username: req.body.username })
      .then((user) => {
        if (!user) {
          console.log("User not found");
          // Handle the case when the user is not found
        } else {
          var payload = { 
            id: user.id, 
            expire: Date.now() + 1000 * 60 * 60 * 24 * 7 
          }
    
          var token = jwt.encode(payload, config.jwtSecret)
    
          res.json({ token: token })
        }
      })
      .catch((err) => {
        console.log("Error:", err);
        // Handle any errors that occurred during the query
      });
  };
  

  exports.register = function (req, res) {
    User.register(
      new User({ 
        email: req.body.email, 
        username: req.body.username 
      }), req.body.password, function (err, msg) {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successful" });
        }
      }
    );
  };

  exports.profile = function(req, res) {
    res.json({
      message: 'You made it to the secured profile',
      user: req.user,
      token: req.query.secret_token
    })
  }