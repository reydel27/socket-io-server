const { response } = require('express');

const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator');

const User = require('../models/user');
const { generateJWT, validateJWT } = require('../helpers/jwt');

const createUser = async ( req, res = response ) => {

    const errors = validationResult( req );

    if( !errors.isEmpty() ){
        return res.status(401).json({
            ok: false,
            errors: errors.mapped()
        });
    }



    const user = new User( req.body );
    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync( user.password, salt );
    
    await user.save();

    // Generate JWT
    const token = await generateJWT( user.id );


    res.json({
        ok: true,
        user,
        token
    });    

}

const signinUser = async ( req, res = response) => {

    const errors = validationResult( req );

    if( !errors.isEmpty() ){
        return res.status(401).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    const { email, password } = req.body;

    try {
        const userDB = await User.findOne({ email });
        if( !userDB ){
            return res.status(400).json({
                ok: false,
                errors: 'Error in login process'
            });
        }
        // Validate password
        const validPassword = bcrypt.compareSync( password, userDB.password );
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                errors: 'Error in login process ***'
            });        
        }

        // Generate JWT
        const token = await generateJWT( userDB.id );

        res.json({
            ok: true,
            user: userDB,
            message: 'Sign in successfull',
            token
        });      

    }catch (err) {
        return res.status(401).json({
            ok: false,
            errors: err.message            
        });
    }
}

const refreshToken = async( req, res = response) => {

    const token = await req.header('x-token');
    
    try{

        if( !token ){
            return res.status(401).json({
                ok: false,
                errors: 'The authorization token has not been sent'
            });
        }
        // validar el token y extraer el uid del usuario
        const uid = await validateJWT( token );
        // generar nuevo token si este no ha expirado
        const newToken = await generateJWT( uid );

        res.json({
            ok: true,
            uid: uid,
            token: newToken,
            message: 'Refresh token success',
            
        });           
    }catch(err){
        return res.status(401).json({
            ok: false,
            errors: err.message            
        });
    }
}

module.exports = {
    createUser,
    signinUser,
    refreshToken
}