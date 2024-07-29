const mongodb = require('mongodb').MongoClient;
const mongodb_config = require('../../mongodbConfigure/mongodbConfig');
const mongodb_objectId = require('mongodb').ObjectId;
const mongodb_connection_string = new mongodb_config();
const db_connection = 'hrm';
const coll_connection = 'tblemployee';


// get the number of total employee

async function get_total_employee(todate)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
    try {
        const pool = await connect_db.collection(coll_connection).aggregate(
            [
                {
                    $group:{
                        _id:{},
                        totalEmployee:{
                            $count:{}
                        }
                    }
                }
            ]
        ).toArray();
        return pool;
    } catch (error) {
        throw error;
    } finally
    {
        connection.close();
    }
};

module.exports = {
    get_total_employee: get_total_employee,
};