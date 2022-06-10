const jwt = require('jsonwebtoken');

let requireAuth = (req, res, next) => {

    let errmsg = "Your login session has expired, please re-login to proceed!";

    let token;
    try {
        token = req.headers['token'].replace(/['"]+/g, '');
    }
    catch (err) {
        res.json({
            status: 'error',
            error: errmsg
        });
    }

    //check whether jwt exists and it is verified
    if(token){
        jwt.verify(token, process.env.JWT_ENV, (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.json({
                    status: 'error',
                    error: errmsg
                });
            }
            else{
                next();
            }
        });
    }
    else{
        console.log('not token');
        res.json({
            status: 'error',
            error: errmsg
        });
    }

};

let requireRouteAuth = (req, res, next) => {

    let token;
    try {
        token = req.headers['token'].replace(/['"]+/g, '');
    }
    catch (err) {
        res.json({
            status: 'auth-error',
            error: errmsg
        });
    }

    //check whether jwt exists and it is verified
    if(token){
        jwt.verify(token, process.env.JWT_ENV, (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.json({
                    status: 'auth-error',
                    error: errmsg
                });
            }
            else{
                next();
            }
        });
    }
    else{
        console.log('not token');
        res.json({
            status: 'auth-error',
            error: errmsg
        });
    }

};

const maxAge = 1 * 24 * 60 * 60;
const createToken = () => {
    return jwt.sign({value: Date.now()}, process.env.JWT_ENV, {
        expiresIn: maxAge
    });
};

module.exports = {
    requireAuth,
    requireRouteAuth,
    createToken,
};