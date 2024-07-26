require('dotenv').config();

const mongod_config = (
    function(){
        const connection = new WeakMap();
        return class cl_connect{
            constructor(){
                this.get_connection = connection.set(this,
                    `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@localhost:${process.env.MONGODB_PORT}/?authMechanism=${process.env.MONGODB_AUTHMECHANISM}`
                );
            }
            getConnectString()
            {
                return connection.get(this);
            }
        }
    }
)();

module.exports = mongod_config;