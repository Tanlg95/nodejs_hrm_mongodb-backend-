require('dotenv').config();
const jwt = require('jsonwebtoken');
const statusClass = require('../support/status');
const status = new statusClass();

const auth = function(req,res,next)
{
    try {
        const tokenForAuth = req.body.atoken || req.query.atoken || req.headers["atoken"];
        if(!tokenForAuth) throw status.errorStatus(5);
        const payload = jwt.verify(tokenForAuth, process.env.MONGODB_ACCESSTOKEN);
        if(!payload) throw status.errorStatus(4);
        //console.log(payload);
        next();
    } catch (error) {
        throw error;    
    }
};


module.exports = auth;