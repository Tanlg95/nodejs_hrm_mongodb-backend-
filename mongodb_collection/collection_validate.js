
const collection = (
    function(){
        const collection_sc = new WeakMap();
        function coll_sc(coll_name){
        let coll_script = undefined;
        switch(coll_name)
        {
            case "tblemployee":
                coll_script = {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: [
                          'employeeId',
                          'employeeName',
                          'employedDate',
                          'birthDate',
                          'isActive'
                        ],
                        properties: {
                          employeeId: {
                            bsonType: 'string',
                            minLength: 5,
                            maxLength: 50
                          },
                          employeeName: {
                            bsonType: 'string',
                            maxLength: 150
                          },
                          employedDate: {
                            bsonType: 'date'
                          },
                          birthDate: {
                            bsonType: [
                              'null',
                              'date'
                            ]
                          },
                          isActive: {
                            bsonType: ['bool','null']
                          }
                        }
                      }
                }
                break;
            case "tblref_position":
                coll_script = {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: [
                          'posId',
                          'posName',
                          'note'
                        ],
                        properties: {
                          posId: {
                            bsonType: 'string',
                            maxLength: 50
                          },
                          posName: {
                            bsonType: 'string',
                            maxLength: 150
                          },
                          note: {
                            bsonType: [
                              'string',
                              'null'
                            ],
                            maxLength: 150
                          }
                        }
                      }
                }
                break;
            case "tblemppos":
                coll_script = {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: [
                          'employeeId',
                          'datechange',
                          'posId',
                          'note'
                        ],
                        properties: {
                          employeeId: {
                            bsonType: 'string',
                            minLength: 5,
                            maxLength: 50
                          },
                          datechange: {
                            bsonType: 'date'
                          },
                          posId: {
                            bsonType: 'string',
                            maxLength: 50
                          },
                          note: {
                            bsonType: [
                              'string',
                              'null'
                            ],
                            maxLength: 150
                          }
                        }
                      }
                }
                break;
            case "tblaccount":
                coll_script = {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: [
                          'accountId',
                          'accountName',
                          'email',
                          'pwd',
                          'atoken',
                          'ftoken',
                          'note'
                        ],
                        properties: {
                          accountId: {
                            bsonType: 'string',
                            maxLength: 50
                          },
                          accountName: {
                            bsonType: 'string',
                            maxLength: 150
                          },
                          email: {
                            bsonType: [
                              'string',
                              'null'
                            ],
                            maxLength: 150
                          },
                          pwd: {
                            bsonType: 'string',
                            maxLength: 1500
                          },
                          atoken: {
                            bsonType: 'string',
                            maxLength: 1500
                          },
                          ftoken: {
                            bsonType: 'string',
                            maxLength: 1500
                          },
                          note: {
                            bsonType: [
                              'null',
                              'string'
                            ],
                            maxLength: 150
                          }
                        }
                      }
                }
                break;
        }
         return coll_script;
        }
        
        return class coll{
            constructor(coll_name){
                this.collections = collection_sc.set(this, coll_sc(coll_name));
            }
            get_collection()
            {
                return collection_sc.get(this);
            }
        }
    }
)();

module.exports = collection;