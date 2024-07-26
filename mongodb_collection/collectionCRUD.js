const mongodb = require('mongodb').MongoClient;
const mongodb_config = require('../mongodbConfigure/mongodbConfig');
const mongodb_objectId = require('mongodb').ObjectId;
const mongodb_connection_string = new mongodb_config();
const coll_script = require('../mongodb_collection/collection_validate');
const db_connection = 'hrm';


// create collection for tblemployees

async function collection_tblemployee()
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
    const coll_name = 'tblemployee';
    try {
        const coll_valid = new coll_script(coll_name).get_collection();
        // create collection
        try{
            await connect_db.createCollection(coll_name,
                {
                    validator: coll_valid
                }
            )
        }
        // mod collection
        catch{
            await connect_db.command(
                {
                    collMod: coll_name,
                    validator: coll_valid
                }
            )
        }
        // create index
        await connect_db.collection(coll_name).createIndex({
            employeeId: 1
        },{name:"idx_tblemployee", unique: true});
        return {
            statusId: 1,
            description: "tblemployee's collection was created"
        }
    } catch (error) {
        throw error;
    }
};

// create collection for tblref_position

async function collection_tblrefpos()
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
    const coll_name = 'tblref_position';
    try {
        const coll_valid = new coll_script(coll_name).get_collection();
        // create collection
        try{
            await connect_db.createCollection(coll_name,
                {
                    validator: coll_valid
                }
            )
        }
        // mod collection
        catch{
            await connect_db.command(
                {
                    collMod: coll_name,
                    validator: coll_valid
                }
            )
        }
        // create index
        await connect_db.collection(coll_name).createIndex({
            posId: 1
        },{name:"idx_tblrefpos", unique: true});
        return {
            statusId: 1,
            description: "tblref_position's collection was created"
        }
    } catch (error) {
        throw error;
    }
};

// create collection for tblemppos

async function collection_tblemppos()
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
    const coll_name = 'tblemppos';
    try {
        const coll_valid = new coll_script(coll_name).get_collection();
        // create collection
        try{
            await connect_db.createCollection(coll_name,
                {
                    validator: coll_valid
                }
            )
        }
        // mod collection
        catch{
            await connect_db.command(
                {
                    collMod: coll_name,
                    validator: coll_valid
                }
            )
        }
        // create index
        await connect_db.collection(coll_name).createIndex({
            employeeId: 1,
            datechange: -1,
            posId: 1
        },{name:"idx_tblemppos", unique: true});
        return {
            statusId: 1,
            description: "tblemppos's collection was created"
        }
    } catch (error) {
        throw error;
    }
};

// create collection for tblaccount

async function collection_tblaccount()
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
    const coll_name = 'tblaccount';
    try {
        const coll_valid = new coll_script(coll_name).get_collection();
        // create collection
        try{
            await connect_db.createCollection(coll_name,
                {
                    validator: coll_valid
                }
            )
        }
        // mode collection
        catch{
            await connect_db.command(
                {
                    collMod: coll_name,
                    validator: coll_valid
                }
            )
        }
        // create index
        await connect_db.collection(coll_name).createIndex({
            accountId: 1
        },{name:"idx_tblaccount", unique: true});
        return {
            statusId: 1,
            description: "tblaccount's collection was created"
        }
    } catch (error) {
        throw error;
    }
};


module.exports = {
    collection_tblemployee: collection_tblemployee,
    collection_tblrefpos: collection_tblrefpos,
    collection_tblemppos: collection_tblemppos,
    collection_tblaccount: collection_tblaccount,
}