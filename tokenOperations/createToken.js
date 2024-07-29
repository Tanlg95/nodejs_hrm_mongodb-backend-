require('dotenv').config();
const jwt = require('jsonwebtoken');
const statusClass = require('../support/status');
const status = new statusClass();

const createToken = function(payload,opt){

    // access token => opt: 1
    // refresh token => opt: 2
    if(!([1,2].includes(opt))) throw status.errorStatus(7,[1,2])
    try {
        let token = undefined;
        switch(opt)
        {
            case 1:
                token = jwt.sign(payload,process.env.MONGODB_ACCESSTOKEN,{
                    expiresIn: "30m"
                });
            break;
            case 2:
                token = jwt.sign(payload,process.env.MONGODB_REFRESHTOKEN,{
                    expiresIn: "60d"
                });
            break;
        }
    return token;
       
    } catch (error) {
        throw error
    }
};

module.exports = createToken;