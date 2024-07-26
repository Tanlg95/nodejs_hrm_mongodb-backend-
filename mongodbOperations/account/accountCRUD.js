const mongodb = require('mongodb').MongoClient;
const createToken = require('../../tokenOperations/createToken');
const renewToken = require('../../tokenOperations/renewToken');
const bcrypt = require('bcrypt');
const mongodb_config = require('../../mongodbConfigure/mongodbConfig');
const mongodb_objectId = require('mongodb').ObjectId;
const mongodb_connection_string = new mongodb_config();
const db_connection = 'hrm';
const coll_connection = 'tblaccount';


// create account

async function create_account(body)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
    try {
        if(!(body.body instanceof Array)) throw new Error('body must be an array!!!');
        const account_list_insert = body.body.map(
            function(val)
            {
                const payloadForToken = {
                    accountId: val.accountId,
                    accountName: val.accountName,
                    email: (!val.email) ? null : val.email
                };
                const atoken = createToken(payloadForToken,1),
                      ftoken = createToken(payloadForToken,2);
                return {
                    accountId: val.accountId,
                    accountName: val.accountName,
                    email: (!val.email) ? null : val.email,
                    pwd: bcrypt.hashSync(val.pwd, bcrypt.genSaltSync(10)), // create encrypt password
                    atoken: atoken,
                    ftoken: ftoken,
                    note: (!val.note) ? null : val.note
                }
            });
        const pool = connect_db.collection(coll_connection).insertMany(account_list_insert);
        return pool;
    } catch (error) {
        throw error;
    }
}

// update account's information

async function update_account(body)
{
   const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
   const connect_db = connection.db(db_connection);
   try {
        if(!(body.body) instanceof Array) throw new Error('body must be an array!!!');
        for(let ele of body.body)
        {
            await connect_db.collection(coll_connection).updateOne(
                {_id: new mongodb_objectId(ele._id)},
                {
                    $set:{
                        accountName: ele.accountName,
                        email: (!ele.email)? null : ele.email,
                        note: (!ele.note)? null : ele.note
                    }
                }
            )
        }
        return {check: 1};
   } catch (error) {
       throw error;
   }
}

// delete account

async function delete_account(body)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
   try {
        if(!(body.body) instanceof Array) throw new Error('body must be an array!!!');
        const account_list_delete = [];
        for(let ele of body.body)
        {
            account_list_delete.push(new mongodb_objectId(ele._id));
        }
        const pool = await connect_db.collection(coll_connection).deleteMany(
            {_id:{$in: account_list_delete }}
        )
        return  pool;
   } catch (error) {
        throw error;
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
        if(!(body.body) instanceof Array) throw new Error('body must be an array!!!');
        let account_token_update = body.body;
        account_token_update = account_token_update.map(function(val){
            if(!([0,1,2].includes(val.opt))) throw new Error('opt must be in (0,1,2)');
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
            switch(ele.opt)
            {
                case 0:
                    await connect_db.collection(coll_connection).updateOne(
                        {_id: ele._id},
                        {
                            $set:{
                                atoken: ele.atoken,
                                ftoken: ele.ftoken
                            }
                        });
                break;
                case 1:
                    await connect_db.collection(coll_connection).updateOne(
                        {_id: ele._id},
                        {
                            $set:{
                                atoken: ele.atoken
                            }
                        });
                break;
                case 2:
                    await connect_db.collection(coll_connection).updateOne(
                        {_id: ele._id},
                        {
                            $set:{
                                ftoken: ele.ftoken
                            }
                        });
                break;
                    
            } 
        }
        return {
            check: 1
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    create_account: create_account,
    update_account: update_account,
    delete_account: delete_account,
    update_token_account: update_token_account,
};