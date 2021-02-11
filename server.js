const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');
const hat = require('hat');

//For hashing the passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Database
const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let employees_collection = null;
let carmodels_collection = null;
let sale_collection = null;
let user_collection = null;
var ObjectId = require('mongodb').ObjectId; 
const { computeHeadingLevel } = require('@testing-library/react');

//Connect to the database
mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
  if (err) {
    console.error(err)
    return
  }
    const db = client.db('car_dealer');
    employees_collection = db.collection('employees_collection');
    carmodels_collection = db.collection('carmodels_collection');
    sale_collection = db.collection('sale_collection');
    user_collection = db.collection('user_db');
    employees_collection.find().toArray((err, items) => {
    })
});


/**
 * Function to get all employees within the company
 * @return {List} Returns a list with employees and their parameters
 */
app.get('/employees', function(req, res) {
    let employees_list = [];
    let cursor = employees_collection.find();
    cursor.forEach(
        function(x) {
            x.employees.forEach (function(employee) {
                employees_list.push({id: employee.id, name: employee.name});
            });
        },
        function(err) {
            return res.json(employees_list);
        }
    );
});

/**
 * Returns all available carmodels
 * @return {List} Returns a list with the carmodels and their parameters
 */
app.get('/carmodels', function(req, res) {
    let carmodels_list = [];
    //let cursor = carmodels_collection.find();
    let cursor = carmodels_collection.find({} , {carmodels: 1, _id:0});
    
    cursor.forEach(
        function(x) {
            x.carmodels.forEach (function(carmodel) {
                carmodels_list.push({id: carmodel.id, brand: carmodel.brand, model: carmodel.model, price: carmodel.price});
            });
        },
        function(err) {
            return res.json(carmodels_list);
        }
    );
});

/**
 * Function for adding a new carmodel
 * @param {String} brand Brand of the new carmodel
 * @param {String} model Model of the new carmodel
 * @param {number} price Price of the new carmodel
 * @return {Carmodel} Returns the new carmodel
 */
app.post('/carmodels', function(req, res) {
    let id = 1;
    let cursor = carmodels_collection.find({}, {_id: 0, carmodels: 0, nextId : 1});
    cursor.forEach(
        function(x) {
            id = x.nextId;
        }, function(err) {
            let newValue = {$inc: { nextId: 1}};
            carmodels_collection.updateOne({}, newValue, function(err, res) {
                if (err) throw err;
            });

            const {brand, model, price} = req.body;
            let new_carmodel = {id, brand, model, price};
            carmodels_collection.updateOne( { }, { $push: { carmodels: new_carmodel }});
            res.send({new_carmodel});
        }
    );    
});

/**
 * Function for adding a new carmodel
 * @param {String} id Id of the carmodel that should be deleted
 * @return {Carmodel} Returns the id of the deleted carmodel
 */
app.delete('/carmodels', function(req, res) {
    //let deleted_carmodel = { brand: req.body.brand, model: req.body.model, price: req.body.price};
    let id = req.body.id
    carmodels_collection.updateOne( { }, { $pull: { carmodels: { id: id} }});
    res.send({id});
});

/**
 * Function for giving the total sale of each employee with there parameters such as id and name
 * @return {List} Returns a list of the total sales for each employee
 */
app.get('/total_sales', function(req, res) {
    let total_sales = {};
    let carmodels_price = {};
    let carmodel_query = carmodels_collection.find({} , {carmodels: 1, _id:0});
    
    carmodel_query.forEach(
        function(x) {
            x.carmodels.forEach (function(carmodel) {
                carmodels_price[carmodel.id] = carmodel.price;
            });
        },
        function(err) {
            let sales_query = sale_collection.find({} , {sales: 1, _id:0});
            sales_query.forEach(
                function(x) {
                    x.sales.forEach (function(sale) {
                        if(total_sales[sale.employee_id]) {
                            total_sales[sale.employee_id] = carmodels_price[sale.carmodel_id] + total_sales[sale.employee_id];    
                        } else {
                            total_sales[sale.employee_id] = carmodels_price[sale.carmodel_id];
                        }
                    });
                },
                function(err) {
                    let employee_query = employees_collection.find({} , {employees: 1, _id:0});
                    employee_query.forEach(
                        function(x) {
                            x.employees.forEach (function(employee) {
                                total_sales[employee.id] =  {id: employee.id, name: employee.name, sales: total_sales[employee.id]};
                            });
                        },
                        function(err) {
                            let keys = Object.keys(total_sales);
                            total_sales_list = [];
                            keys.map(id => total_sales_list.push(total_sales[id]));
                            return res.json(total_sales_list);
                        }
                    );  
                }
            );
        }
    );  
});

/**
 * Function for adding a new user
 * @param {String} name Name of the new user
 * @param {String} id Id of the new user, can be none
 * @param {String} username Email of the new user
 * @param {String} password Password of the new user
 * @return {String} Returns OK if username and id are unique, otherwise user feedback
 */
app.post('/create_user' , function(req, res)  {
    const { name, id, username, password} = req.body;
    let new_user = { name, id, email: username, password};
    user_collection.findOne({"users.email": username}, function(err, user){
        if(err) {
          console.log(err);
          message="error"
          return res.json({message: message})
        }
        let message='';
        if(user) {
            message = "Användarnamnet existerar redan!";
            return res.json({message: message})
        } else {
            
            if(id !== ''){
                user_collection.findOne({"users.id": id}, function(err, user){
                    if(err) {
                    console.log(err);
                    }
                    let message='';
                    if(user) {
                        message = "Anställningsnumret är redan registrerat!";
                    } else {
                        message= "OK";
                        bcrypt.hash(password, saltRounds, (err, hash) => {
                            let new_user = { name, id, email: username, password: hash};
                            user_collection.updateOne( { }, { $push: { users: new_user }});
                        });
                    }
                        return res.json({message: message});
                    });
            } else  {
                message= "OK";
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    let new_user = { name, id, email: username, password: password};
                    user_collection.updateOne( { }, { $push: { users: new_user }});
                });
                return res.json({message: message});
            }
        }
    });
});

/**
 * Function for authorizing a user
 * @param {String} username Username from input
 * @param {String} password Password from input
 * @return {Object} Returns OK and a token if username and password are correct, otherwise that it failed
 */
app.post('/login' , function(req, res)  {
    const { username, password} = req.body;
    console.log(username);
    let token = '';
    let message = "Inloggning misslyckades!";
    user_collection.findOne({"users.email": username}, function(err, exists){
        if(err) {
          console.log(err);
          message="error";
          return res.json({message: message});
        }
        if(exists) {
            exists.users.forEach(
                function(user) {
                    bcrypt.compare(password, user.password, function(err, pass) {
                        if (user.email === username && pass) {
                            token = hat();
                            const {id, name, email, password} = user;
                            let user_with_token = {id, name, email, password, token}
                            user_collection.updateOne({}, {$pull : { users: { email: email}}});
                            user_collection.updateOne( {}, { $push: { users: user_with_token }});
                            message = "OK";
                            return res.json({message, token});
                        }
                    });
                },
                function(err) {
                    
                    return res.json({message, token});
                }
            );
            
        } else {
            message = "Inloggning misslyckades!";
            return res.json({message, token});
        }        
    }); 
});

/**
 * Function for getting the information to the profile page
 * @param {String} token Token that the current user have in the localstorage
 * @return {Object} Returns the parameters of the employee that is logged in with sales parameters
 */
app.post('/get_user_profile', function(req, res) {
    const token = req.body.token;
    let total_sales = {};
    let carmodels_price = {};
    let carmodel_query = carmodels_collection.find({} , {carmodels: 1, _id:0});
        
        carmodel_query.forEach(
            function(x) {
                x.carmodels.forEach (function(carmodel) {
                    carmodels_price[carmodel.id] = carmodel.price;
                });
            },
            function(err) {
                let sales_query = sale_collection.find({} , {sales: 1, _id:0});
                sales_query.forEach(
                    function(x) {
                        x.sales.forEach (function(sale) {
                            if(total_sales[sale.employee_id]) {
                                total_sales[sale.employee_id] = carmodels_price[sale.carmodel_id] + total_sales[sale.employee_id];    
                            } else {
                                total_sales[sale.employee_id] = carmodels_price[sale.carmodel_id];
                            }
                        });
                    },
                    function(err) {
                        let employee_query = employees_collection.find({} , {employees: 1, _id:0});
                        employee_query.forEach(
                            function(x) {
                                x.employees.forEach (function(employee) {
                                    total_sales[employee.id] =  {id: employee.id, name: employee.name, sales: total_sales[employee.id]};
                                });
                            },
                            function(err) {
                                let id = 0;
                                let sales = {};
                                let message='Något gick fel';
                                
                                let user_query = user_collection.find({} , {users: 1, _id:0});
                                user_query.forEach(
                                    function(x) {
                                        x.users.forEach (function(user) {
                                            if (user.token === token) {
                                                id = user.id;
                                                message="OK";
                                                sales = total_sales[id];
                                            }
                                        });
                                    }, function(err) {
                                        return res.json({message, sales});
                                    }
                                );  
                            }
                        );
                    }
                );
            }
        );
        
    });

/**
 * Function for checking if the current user is an employee
 * @param {String} token Token that the current user have in the localstorage
 * @return {String} Returns OK if it is an employee otherwise NOK
 */
app.post('/is_employee', function(req, res) {
    const token = req.body.token;
    let user_query = user_collection.find({} , {users: 1, _id:0});
    let message = 'Misslyckades att hitta';
    user_query.forEach(
        function(x) {
            x.users.forEach (function(user) {
                if (user.token === token && user.id !=='') {
                    message="OK";
                }
            });
        }, function(err) {
                return res.json({message});
        }
    );  
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log(port);