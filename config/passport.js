/**
 * Passport configuration
 *
 * @author Mike
 */

var local_login = require('./passport/local_login');
var local_signup = require('./passport/local_signup');
var facebook = require('./passport/facebook');
var twitter = require('./passport/twitter');
var google = require('./passport/google');

var logger = require('../logger');


module.exports = function (app, passport) {
	logger.debug('config/passport called.');

    passport.serializeUser(function(user, done) {
        logger.debug('serializeUser() called.');
        console.dir(user);

        done(null, user); 
    });

    passport.deserializeUser(function(user, done) {
        logger.debug('deserializeUser() 호출됨.');
        console.dir(user);

        done(null, user);  
    });

	passport.use('local-login', local_login);
	passport.use('local-signup', local_signup);
	passport.use('facebook', facebook(app, passport));
	passport.use('twitter', twitter(app, passport));
	passport.use('google', google(app, passport));
	logger.info('5 passport authentication registered.');
	
};