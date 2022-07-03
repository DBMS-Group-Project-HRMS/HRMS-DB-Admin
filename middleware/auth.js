const jwt = require('jsonwebtoken');

let requireAuth = (req, res, next) => {

    let errmsg = "Your login session has expired, please re-login to proceed!";
    let token;
    try {
        token = req.headers['token'].replace(/['"]+/g, '');
    }
    catch (err) {
        return res.json({
            status: 'error',
            error: errmsg
        });
    }

    //check whether jwt exists and it is verified
    if(token){
        jwt.verify(token, process.env.JWT_ENV, (err, decodedToken) => {
            if(err){
                console.log(err.message);
                return res.json({
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
        return res.json({
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
        return res.json({
            status: 'auth-error',
            error: errmsg
        });
    }

    //check whether jwt exists and it is verified
    if(token){
        jwt.verify(token, process.env.JWT_ENV, (err, decodedToken) => {
            if(err){
                console.log(err.message);
                return res.json({
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
        return res.json({
            status: 'auth-error',
            error: errmsg
        });
    }

};

const maxAge = 1 * 24 * 60 * 60;
const createToken = async (user) => {
    const accessToken = await jwt.sign(
        {
            username: user.username,
            userId: user.id,
            role: user.type,
            paygrade: user.paygrade,
        },
        process.env.JWT_ENV,
        {
            expiresIn: maxAge
        }
        );
        return accessToken;
};

module.exports = {
    requireAuth,
    requireRouteAuth,
    createToken,
};