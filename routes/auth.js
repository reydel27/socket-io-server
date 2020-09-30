/*
    path: /api/login
*/

const { Router, response } = require('express');
const { check } = require('express-validator');
const { createUser, signinUser, refreshToken } = require('../controllers/auth');
const User = require('../models/user');

const router = Router();

router.post('/signup', [
    /* Username validations */
    check('username','Username is required').not().isEmpty(),
    check('username','Minim lenght 6').isLength({ min: 6 }),
    /* Email validations */
    check('email','Email is required').not().isEmpty(),
    check('email','Email is not valid').isEmail(),
    // Email is unique 
    check('email').custom((value) => {
        var query = User.find({ email: value })
        return query.exec().then(user => {
            if(user.length > 0) {
                return Promise.reject('Email ' + value + ' is already in use');
            }
        });
    }),
    // End email is unique 
    /* Password validations */
    check('password','Password is required').not().isEmpty(),
    check('password','Minim lenght 6').isLength({ min: 6 }),    
],createUser );

router.post('/signin', [
    /* Email validations */
    check('email','Email is required').not().isEmpty(),
    /* Password validations */
    check('password','Password is required').not().isEmpty(),
],signinUser );
// Validate token and refresh
router.get('/refresh-token', refreshToken);

module.exports = router;