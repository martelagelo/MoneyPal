var User = require('../../models/User');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.load({ criteria:{_id:id} }, function(err, user) {
            done(err, user);
        });
    });

}