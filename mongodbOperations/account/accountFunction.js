const mongodb = require('mongodb').MongoClient;
const createToken = require('../../tokenOperations/createToken');
const renewToken = require('../../tokenOperations/renewToken');
const bcrypt = require('bcrypt');
const mongodb_config = require('../../mongodbConfigure/mongodbConfig');
const mongodb_objectId = require('mongodb').ObjectId;
const statusClass = require('../../support/status');
const status = new statusClass();
const mongodb_connection_string = new mongodb_config();
const db_connection = 'hrm';
const coll_connection = 'tblaccount';


// login account

async function login(body)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
    try {
        // get the password for compare
        const get_password = await connect_db.collection(coll_connection).find({_id: new mongodb_objectId(body._id)}).toArray();
        // compare passwords
        const check_password = bcrypt.compareSync(body.pwd,get_password[0].pwd);
        if(!check_password) throw status.errorStatus(3);
        // return employee's information
        return {
            statusId: status.operationStatus(104),
            accountId: get_password[0].accountId,
            statusName: status.operationStatus(102),
            atoken: get_password[0].atoken
        };
    } catch (error) {
        throw error;
    }  finally
    {
        connection.close();
    }
};


// change password

async function changePassword(body)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
    try {
        // get the password for compare
        const get_password = await connect_db.collection(coll_connection).find({_id: new mongodb_objectId(body._id)}).toArray();
        // compare passwords
        const check_password = bcrypt.compareSync(body.pwd,get_password[0].pwd);
        if(!check_password) throw status.errorStatus(3);
        // create a new password
        const new_password = bcrypt.hashSync(body.new_password, bcrypt.genSaltSync(10));
        // update password
        const pool = await connect_db.collection(coll_connection).updateOne(
            {_id: new mongodb_objectId(body._id)},
            {
                $set:{
                    pwd: new_password
                }
            }
        );
        return {
            statusId: status.operationStatus(104),
            statusName: (pool.modifiedCount === 1) ? status.operationStatus(103) : ''
        };
    } catch (error) {
        throw error;
    } finally
    {
        connection.close();
    }
}

module.exports = {
    login: login,
    changePassword: changePassword
};