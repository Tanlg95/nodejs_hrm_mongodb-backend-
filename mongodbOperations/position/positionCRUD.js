const mongodb = require('mongodb').MongoClient;
const mongodb_config = require('../../mongodbConfigure/mongodbConfig');
const mongodb_objectId = require('mongodb').ObjectId;
const statusClass = require('../../support/status');
const status = new statusClass();
const mongodb_connection_string = new mongodb_config();
const db_connection = 'hrm';
const coll_connection = 'tblemppos';

// get employee's position

async function get_position_employee(body)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
   try {
        const pool = await connect_db.collection(coll_connection).aggregate(
            [
                {
                    $match:{$and:[
                        {datechange:{$lte: new Date(body.todate)}},
                        (!body.employeeId)? {$expr:{$eq:[1,1]}} : {employeeId:{$eq:body.employeeId}}
                    ]}
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

// create employee's position

async function insert_position_employee(body)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
   try {
        if(!(body.body instanceof Array)) throw status.errorStatus(1);
        // get employee list => project: employeeId: 1
        const get_tblemployee = await connect_db.collection('tblemployee').find().project({employeeId: 1,_id:0}).toArray();
        // get position list => project: posId: 1
        const get_tblref_pos = await connect_db.collection('tblref_position').find().project({posId: 1, _id: 0}).toArray();
        // check valid input
        let position_list_insert = body.body;
        position_list_insert = (position_list_insert.filter(function(ele){
            // check exists employeeId
            const valid_employeeId = [...get_tblemployee].map(val => val.employeeId).includes(ele.employeeId);
            // check exists posId
            const valid_posId = [...get_tblref_pos].map(val => val.posId).includes(ele.posId);
            if(valid_employeeId && valid_posId)
            return ele;
        })).map( ele =>
            ({
                employeeId: ele.employeeId,
                datechange: new Date(ele.datechange),
                posId: ele.posId,
                note: (!ele.note)? null : ele.note
            })
        );
        const pool = await connect_db.collection(coll_connection).insertMany(position_list_insert);
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

// update employee's position

async function update_position_employee(body)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
   try {
        // The total number of rows modified 
        let totalRowAffected = 0;
        if(!(body.body instanceof Array)) throw status.errorStatus(1);
        // get position list => project: posId: 1
        const get_tblref_pos = await connect_db.collection('tblref_position').find().project({posId: 1, _id: 0}).toArray();
        // check valid input
        let position_list_update = body.body;
        position_list_update = (position_list_update.filter(function(ele){
            // check exists posId
            const valid_posId = [...get_tblref_pos].map(val => val.posId).includes(ele.posId);
            if(valid_posId)
            return ele;
        })).map( ele =>
            ({
                _id: new mongodb_objectId(ele._id),
                datechange: new Date(ele.datechange),
                posId: ele.posId,
                note: (!ele.note)? null : ele.note
            })
        );
   
        // update positions of employees
        for(let ele of position_list_update)
        {
            const pool = await connect_db.collection(coll_connection).updateOne(
                {_id: ele._id},
                {
                    $set:{
                        datechange: ele.datechange,
                        posId: ele.posId,
                        note: ele.note
                    } 
                }
            );
            totalRowAffected += ((pool.modifiedCount === 1) ? 1 : 0);
        }
        return {
            statusId: status.operationStatus(104),
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

// delete employee's position

async function delete_position_employee(body)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
   try {
        if(!(body.body instanceof Array)) throw status.errorStatus(1);
        const position_list_delete = [];
        for(let ele of body.body)
        {
            position_list_delete.push(new mongodb_objectId(ele._id));
        }
        
        const pool = await connect_db.collection(coll_connection).deleteMany(
            {
                _id:{$in: position_list_delete}
            }
        );
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

module.exports = {
    get_position_employee: get_position_employee,
    insert_position_employee: insert_position_employee,
    update_position_employee: update_position_employee,
    delete_position_employee: delete_position_employee

};