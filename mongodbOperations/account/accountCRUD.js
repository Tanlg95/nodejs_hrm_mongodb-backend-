const mongodb = require('mongodb').MongoClient;
const createToken = require('../../tokenOperations/createToken');
const renewToken = require('../../tokenOperations/renewToken');
const bcrypt = require('bcrypt');
const mongodb_config = require('../../mongodbConfigure/mongodbConfig');
const mongodb_objectId = require('mongodb').ObjectId;
const statusClass = require('../../support/status');
const status = new statusClass();
const valid = require('../../support/valid');
const mongodb_connection_string = new mongodb_config();
const db_connection = 'hrm';
const coll_connection = 'tblaccount';


// create account

async function create_account(body)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
    try {
        if(!(body.body instanceof Array)) throw status.errorStatus(1);
        const account_list_insert = body.body.map(
            function(val)
            {
                const payloadForToken = {
                    accountId: val.accountId,
                    accountName: val.accountName,
                    email: (!val.email) ? null : valid.validEmail(val.email)
                };
                const atoken = createToken(payloadForToken,1),
                      ftoken = createToken(payloadForToken,2);
                return {
                    accountId: val.accountId,
                    accountName: val.accountName,
                    email: (!val.email) ? null : val.email,
                    pwd: bcrypt.hashSync(valid.validPassword(val.pwd), bcrypt.genSaltSync(10)), // create encrypt password
                    atoken: atoken,
                    ftoken: ftoken,
                    note: (!val.note) ? null : val.note
                }
            });
        const pool = await connect_db.collection(coll_connection).insertMany(account_list_insert);
        return {
            statusId: status.operationStatus(104),
            totalRowInserted: pool.insertedCount
        };
    } catch (error) {
        throw error;
    } finally
    {
        connection.close();
    }
}

// update account's information

async function update_account(body)
{
   const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
   const connect_db = connection.db(db_connection);
   try {
        // The total number of rows modified 
        let totalRowAffected = 0;
        if(!(body.body) instanceof Array) throw status.errorStatus(1);
        for(let ele of body.body)
        {
            const pool = await connect_db.collection(coll_connection).updateOne(
                {_id: new mongodb_objectId(ele._id)},
                {
                    $set:{
                        accountName: ele.accountName,
                        email: (!ele.email)? null : valid.validEmail(ele.email),
                        note: (!ele.note)? null : ele.note
                    }
                }
            );
            totalRowAffected += ((pool.modifiedCount === 1) ? 1 : 0);
        }
        return {
            statusId: status.operationStatus(104),
            totalRow: (body.body).length,
            totalRowModified: totalRowAffected
        };
   } catch (error) {
       throw error;
   } finally
   {
       connection.close();
   }
}

// delete account

async function delete_account(body)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
   try {
        if(!(body.body) instanceof Array) throw status.errorStatus(1);
        const account_list_delete = [];
        for(let ele of body.body)
        {
            account_list_delete.push(new mongodb_objectId(ele._id));
        }
        const pool = await connect_db.collection(coll_connection).deleteMany(
            {_id:{$in: account_list_delete }}
        )
        return {
            statusId: status.operationStatus(104),
            totalRow: (body.body).length,
            totalRowDeleted: pool.deletedCount
        };
   } catch (error) {
        throw error;
   } finally
   {
       connection.close();
   }
}

// update token

async function update_token_account(body)
{
    /*
    -- opt: 0 => atoken and ftoken
	-- opt: 1 => atoken
	-- opt: 2 => ftoken
    */
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
    try {
        // The total number of rows modified 
        let totalRowAffected = 0;
        if(!(body.body) instanceof Array) throw status.errorStatus(1);
        let account_token_update = body.body;
        account_token_update = account_token_update.map(function(val){
            if(!([0,1,2].includes(val.opt))) throw status.errorStatus(7,[0,1,2]);
            const token = renewToken(val.atoken_old, val.ftoken);
            const empposListForUpdate = {
                atoken: token.atoken,
                ftoken: token.ftoken,
                _id: new mongodb_objectId(val._id),
                opt: val.opt
            };
            return empposListForUpdate;
        });
        
        for(let ele of account_token_update)
        {
            let pool = undefined;
            switch(ele.opt)
            {
                case 0:
                    pool = await connect_db.collection(coll_connection).updateOne(
                        {_id: ele._id},
                        {
                            $set:{
                                atoken: ele.atoken,
                                ftoken: ele.ftoken
                            }
                        });
                break;
                case 1:
                    pool = await connect_db.collection(coll_connection).updateOne(
                        {_id: ele._id},
                        {
                            $set:{
                                atoken: ele.atoken
                            }
                        });
                break;
                case 2:
                    pool = await connect_db.collection(coll_connection).updateOne(
                        {_id: ele._id},
                        {
                            $set:{
                                ftoken: ele.ftoken
                            }
                        });
                break;
                    
            }
            totalRowAffected += ((pool.modifiedCount === 1)? 1 : 0);
        }
        return {
            status: status.operationStatus(104),
            totalRow: (body.body).length,
            totalRowModified: totalRowAffected
        }
    } catch (error) {
        throw error;
    } finally
    {
        connection.close();
    }
}

module.exports = {
    create_account: create_account,
    update_account: update_account,
    delete_account: delete_account,
    update_token_account: update_token_account,
};