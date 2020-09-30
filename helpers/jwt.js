const jwt = require('jsonwebtoken');
const secret = 'ySRnLuMLcyVGahMOqIXjMXPWXARdlzAfIbjgFLxMApocNhvvquSWIPNaWKkmvz';

const generateJWT = ( uid ) => {

    return new Promise((resolve, reject) => {

        
        const payload = { uid };
        jwt.sign(payload, secret, {
            expiresIn: '1h'
        }, ( err, token ) => {
            if( err ){
                // No se pudo crear el token
                reject( err );
            }else{
                // Generar token
                resolve( token );
            }
        })

    });

}

const validateJWT = ( token ) => {

    return new Promise((resolve, reject) => {

        // verify a token symmetric
        jwt.verify(token, secret,(err, decoded) => {
            if( err ){
                reject( err );
            }else{
                resolve( decoded.uid );
            }
        } 
        );
    });
    
   
}
module.exports = {
    generateJWT,
    validateJWT
}