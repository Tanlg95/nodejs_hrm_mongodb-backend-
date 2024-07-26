const mongodb = require('mongodb').MongoClient;
const mongodb_config = require('../../mongodbConfigure/mongodbConfig');
const mongodb_objectId = require('mongodb').ObjectId;
const mongodb_connection_string = new mongodb_config();
const db_connection = 'hrm';
const coll_connection = 'tblemployee';
// get employee information

async function get_employee_info(body)
{
    
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
    try {
        const pool = await connect_db.collection(coll_connection).aggregate(
            [
                {
                    $match:{$and:[
                        {employedDate:{$lte: new Date(body.todate)}},
                        (!body.employeeId)? {$expr:{$eq:[1,1]}} : {employeeId:{$eq:body.employeeId}}
                    ]}
                }
            ]
        ).toArray();
        return pool;
    } catch (error) {
        throw error;
    }
}

// insert employee information

async function insert_employee_info(body)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
    try {
        if(!(body.body instanceof Array)) throw new Error('body must be an array!!!');
        const employee_list_insert = [];
        for(let ele of body.body)
        {
            employee_list_insert.push(
                {
                    employeeId: ele.employeeId,
                    employeeName: ele.employeeName,
                    employedDate: new Date(ele.employedDate),
                    birthDate: new Date(ele.birthDate),
                    isActive: (!ele.isActive)? null : Boolean(ele.isActive),
                }
            )
        }
        const pool = await connect_db.collection(coll_connection).insertMany(employee_list_insert);
        return pool;
    } catch (error) {
        throw error;   
    }
}

// update employee information

async function update_employee_info(body)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection);
    try {
        const employee_list_update =  {
            employeeName: body.employeeName,
            employedDate: new Date(body.employedDate),
            birthDate: new Date(body.birthDate),
            isActive: (!body.isActive)? null : Boolean(body.isActive),
            _id: new mongodb_objectId(body._id)
        };
        // console.log(employee_list_update);
        const pool = await connect_db.collection(coll_connection).updateOne(
            {_id: employee_list_update._id},
            { 
                $set:{
                employeeName: employee_list_update.employeeName,
                employedDate: employee_list_update.employedDate,
                birthDate: employee_list_update.birthDate,
                isActive: employee_list_update.isActive
                }  
            }
        );
        return pool;
    } catch (error) {
        throw error;   
    }
}

// delete employee information

async function delete_employee_info(body)
{
    const connection = await mongodb.connect(mongodb_connection_string.getConnectString());
    const connect_db = connection.db(db_connection); 
    try {
        if(!(body.body instanceof Array)) throw new Error('body must be an array!!!');
        const employee_list_delete = [];
        for(let ele of body.body)
        {
            employee_list_delete.push(new mongodb_objectId(ele._id));
        }
        console.log(employee_list_delete);
        const pool = await connect_db.collection(coll_connection).deleteMany(
            {
                _id:{$in: employee_list_delete}
            }
        );
        return pool;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_employee_info: get_employee_info,
    insert_employee_info: insert_employee_info,
    update_employee_info: update_employee_info,
    delete_employee_info: delete_employee_info,
};