const mongodb = require('mongodb').MongoClient;
const mongodb_config = require('../../mongodbConfigure/mongodbConfig');
const mongodb_objectId = require('mongodb').ObjectId;
const mongodb_connection_string = new mongodb_config();
const db_connection = 'hrm';
const coll_connection = 'tblemppos';

// get current position of employee

async function get_max_position(body)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
    try {
        const pool = await connect_db.collection(coll_connection).aggregate(
            [
                {$setWindowFields:{
                    partitionBy:{empId:"$employeeId"},
                    sortBy:{employeeId: 1, datechange: -1},
                    output:{
                        max_date:{$max:"$datechange"}
                    }
                }},
                {
                    $match:{$expr:{$eq:["$max_date","$datechange"]}}
                },
                {
                    $lookup:{
                        from:"tblref_position",
                        let:{posId_emppos:"$posId"},
                        pipeline:[
                            {$match:{$expr:{$eq:["$$posId_emppos","$posId"]}}},
                            {$unset:["_id","posId","note"]}
                        ],
                        as:"ref_pos"
                    }
                },
                {
                    $set:{posName:{$arrayElemAt:["$ref_pos.posName",0]}}
                },
                {
                    $unset:["ref_pos","max_date"]
                }
            ]
        ).toArray();
        return pool;
        
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_max_position: get_max_position,
};