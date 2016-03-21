var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/User');
var jwt = require('../../JWT_Service/jwt.js');

module.exports = function(passport){

	passport.use('local',new LocalStrategy(function(username, password, done) { 
        // check in mongo if a user with username exists or not
        User.load({ criteria:{ 'userName' :  username } }, 
            function(err, user) {
                if(user) {
                    if(user.userName == username) {
                        if(password == user.password) {
                            User.load({ criteria:{ '_id' :  user._id } ,
                                select:'userName firstName lastName email lastUpdatedAt salary isAdmin'}, 
                                function(err, userDetails) {
                                    return done(null, userDetails);
                                });
                        } else return done(null, false, {msg: 'Incorrect password'});
                    }
                } else return done(null, false, {msg: 'Could not find user with username ' + username});
            }
        );
    }));
  
}