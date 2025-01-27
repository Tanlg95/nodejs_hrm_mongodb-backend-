const express = require('express');
const router = express.Router();
const authToken = require('../tokenOperations/authToken');
const employee = require('../mongodbOperations/employee/employeeCRUD');
const employeeFunction = require('../mongodbOperations/employee/employeeFunction');
const position = require('../mongodbOperations/position/positionCRUD');
const positionFunction = require('../mongodbOperations/position/positionFunction');
const account = require('../mongodbOperations/account/accountCRUD');
const accountFunction = require('../mongodbOperations/account/accountFunction');
const collection = require('../mongodb_collection/collectionCRUD');


//------------------------------ employee ----------------------------------//

/* get employee information */
router.get('/employee',authToken,(req,res,next) =>{
    const body = req.body;
    employee.get_employee_info(body).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

/* create employee information */
router.post('/employee/insert',(req,res,next) =>{
    employee.insert_employee_info(req).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

/* update employee information */
router.post('/employee/update',(req,res,next) =>{
    const body = req.body;
    employee.update_employee_info(body).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

/* delete employee information */
router.post('/employee/delete',(req,res,next) =>{
    employee.delete_employee_info(req).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

/* get the total number of employees */
router.get('/employee/get_total_emp',authToken,(req,res,next) =>{
    const todate = req.body.todate;
    employeeFunction.get_total_employee(todate).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

// // //------------------------------ position ----------------------------------//

/* get employee position */
router.get('/position',authToken,(req,res,next) =>{
    const body = req.body;
    position.get_position_employee(body).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

/* create employee position */
router.post('/position/insert',(req,res,next) =>{
    const body = req;
    position.insert_position_employee(body).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

/* update employee position */
router.post('/position/update',(req,res,next) =>{
    position.update_position_employee(req).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

/* delete employee position */
router.post('/position/delete',(req,res,next) =>{
    position.delete_position_employee(req).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

/* get the current position of an employee */
router.get('/position/get_max_pos',authToken,(req,res,next) =>{
    const body = req.body;
    positionFunction.get_max_position(body).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})


// // //------------------------------ account ----------------------------------//

/* create account */
router.post('/account/create',(req,res,next) =>{
    account.create_account(req).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

/* update account */
router.post('/account/update',(req,res,next) =>{
    account.update_account(req).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

/* delete account */
router.post('/account/delete',(req,res,next) =>{
    account.delete_account(req).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

/* update token account */
router.post('/account/update_atoken',(req,res,next) =>{
    account.update_token_account(req).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

/* login */
router.post('/account/login',(req,res,next) =>{
    const body = req.body;
    accountFunction.login(body).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

/* change account password */
router.post('/account/change_password',(req,res,next) =>{
    const body = req.body;
    accountFunction.changePassword(body).then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

/*---------------------------------------- collection ------------------------------------------- */

// create collection for tblemployees

router.post('/collection/tblemployee',(req,res,next) =>{
    collection.collection_tblemployee().then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

// create collection for tblref_position

router.post('/collection/tblrefpos',(req,res,next) =>{
    collection.collection_tblrefpos().then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

// create collection for tblemppos

router.post('/collection/tblemppos',(req,res,next) =>{
    collection.collection_tblemppos().then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

// create collection for tblaccount

router.post('/collection/tblaccount',(req,res,next) =>{
    collection.collection_tblaccount().then(
        respone => res.json(respone)
    ).catch(
        err => next(err)
    );
})

module.exports = router;