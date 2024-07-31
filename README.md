📜This is my small human resource management personal project (backend API).

🖥Dev with MongoDB + nodejs ( express, mongodb, bcryppt, jsonwebtoken, dotenv, cors, body-parser, nodemon )

🕹Function:
	
	💿Nodejs:
 	
		🧑🏻‍💼Employees: CRUD ( create, read, update, delete ) + some functions to get employee information.
		🧑🏻‍💼Positions: CRUD ( create, read, update, delete ) + some functions to get positions of employees.
	 	🧑🏻‍💼Accounts: CRUD ( create, read, update, delete ) + json web token ( create token, auth token, renew token ) + login + change password + some functions to get account information.
    	
    💿MongoDB:
		🧑🏻‍💼Database + collection ( validation schema ).
    	🧑🏻‍💼Employees:  ( create, read, update, delete ). 
		🧑🏻‍💼Positions:  ( create, read, update, delete ). 
	 	🧑🏻‍💼Accounts:  ( create, read, update, delete ). 
            🧑🏻‍💼Collection: API support auto create collection with validation schema, index. 
   
📝Description:

		1.folder mongodbConfigure: Contains database connection configuration information.
  		2.folder mongodbOperation: Contains CRUD for each module (employees, positions, accounts).
    	3.folder mongodb_collection: Contains validation schema script, CRUD for each collection (employees, positions, accounts).
      	4.folder mongodb_script: Contains hrm backup database.
        	5.router: Contains all API router ( CRUD for each module ).
	 	6.tokenOperations: Contains CRUD for json web token ( create token, auth token, renew token ).
   		7.file index.js: Contains server configuration information.

♻️How to use:

		⚫️Step 1: make sure git is installed on your computer.
  		⚫️Step 2: use git to download this project to your computer (use fork first).
    	⚫️Step 3: use npm install to download all dependencies in package.json 
      	⚫️Step 4: test server use index.js ( run syntax "nodemon" or "npx nodemon").
		⚫️Step 5: restore database from folder mongodb_script ( use hrm folder inside ), you can restore database with mongorestore CMD
  			  if you can not restore database with mongoretore you can use API collection in folder router/router.js and run those APIs with postman to auto creating collection.
       	⚫️Step 5: done !!!
  		
📠If you have any questions about my project, you can contact me 🧔🏻‍♂️


