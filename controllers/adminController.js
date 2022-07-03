const con = require('../database/db_helper');
const auth = require('../middleware/auth');
const enc = require('../middleware/encryptionHandler');

const postAdminLogin = async (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;

    let sql1 = `SELECT * FROM Employee left outer join EmpType on Employee.type = EmpType.ID left outer join User on Employee.user_Id = User.ID WHERE EmpType.type = 'Admin' and user.username = ${con.escape(username)} LIMIT 1`

    console.log(sql1);

    con.query(sql1, async function (err, result) {

        if (err){
            console.log(err);
            return res.status(400).json({
                message: err.sqlMessage
            });
        }
        else{
            if(result.length < 1){
                console.log("no user");
                return res.status(400).json({
                    message: "Incorrect username or password"
                });
            } else{
                const user = result[0];

                const hashed_password = user.password;
                const auth_password = await enc.checkEncryptedCredential(password, hashed_password);
                
                if(auth_password){
                    const accessToken = await auth.createToken(result[0]);
                    return res.status(201).json({
                        token: accessToken,
                        user: user
                    });
                }
                else{
                    console.log("password error");
                    return res.status(400).json({
                        message: "Incorrect username or password"
                    });
                }

            }
        }
    });
}

const postAddHRM = async (req, res) => {

    let data = req.body;
    console.log("*************************", data);
    let username = data.username;

    if(data.password1 !== data.password2){
        console.log("Passwords do not match");
        return res.status(400).json({
            message: "Passwords do not match"
        });
    }
    let hashed_password = await enc.encryptCredential(data.password1);
    // console.log("!!!!!!!!!!!!!!!!!!!!!!");
    let sql1    = `SELECT count(employee.ID) as count FROM employee left outer join user on employee.user_Id = user.ID WHERE email = ${con.escape(data.email)} or employee.nic_number = ${con.escape(data.nic_number)} or user.username = ${con.escape(username)}`;
    con.query(sql1, (err, result) => {
        if(err){
            console.log(err);
            return res.status(400).json({
                message: err.sqlMessage
            });
        }
        else if(result[0].count > 0){
            return res.status(400).json({
                message: "Email, username or NIC already exists!"
            });
        }
        // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        let address_sql = 'insert into Address (Line1, Line2, City, District, Postal_Code) values (?);';
        let address_values = [
            data.Line1,
            data.Line2,
            data.City,
            data.District,
            data.Postal_Code
        ];

        let user_sql = 'insert into User (username, password) values (?);';
        let user_values = [username, hashed_password];

        let emerg_sql = 'insert into EmergencyContact (name, phone_number, Relationship) values (?)'
        let emerge_values = [
            data.Name,
            data.phone_number,
            data.Relationship
        ]

        let sql2 = address_sql + user_sql + emerg_sql;
        let values = [address_values, user_values, emerge_values];

        con.query(sql2, values, (err, result) => {
            if(err){
                console.log(err);
                return res.status(400).json({
                    message: err.sqlMessage
                });
            }
            else{

                let address_id = result[0].insertId;
                let user_id = result[1].insertId;
                let emerge_id = result[2].insertId;

                let emp_sql = 'insert into Employee (firstname, lastname, birthday, email, salary, Joined_date, nic_number, department, maritalStatus, address, type, paygrade, empStatus, user_id, emergency_contact) values (?)';
                let emp_values = [
                    data.firstname, 
                    data.lastname, 
                    data.birthday, 
                    data.email, 
                    data.salary, 
                    data.Joined_date, 
                    data.nic_number, 
                    data.department, 
                    data.maritalStatus, 
                    address_id, 
                    2, 
                    4, 
                    data.empStatus, 
                    user_id, 
                    emerge_id
                ];
                // console.log("************************");
                con.query(emp_sql, [emp_values], (err, result) => {

                    if(err){
                        console.log(err);
                        return res.status(400).json({
                            message: err.sqlMessage
                        });
                    }
                    else{

                        let emp_id = result.insertId;

                        let phone_sql = 'insert into PhoneNumber (emp_ID, phone_number) values ?';
                        let phone_values = [];

                        phone_values.push([emp_id, req.body.phonenumber1]);
                        phone_values.push([emp_id, req.body.phonenumber2]);

                        // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%");

                        con.query(phone_sql, [phone_values], (err, result) => {
                            if(err){
                                console.log(err);
                                return res.status(400).json({
                                    message: err.sqlMessage
                                });
                            }
                            else{
                                console.log(result);
                                return res.status(200).json({
                                    result: result,
                                    message: "HR added successfully"
                                });
                            }
                        })
                    }
                })
            }
        })
    })
}

const getHRM = async (req,res) => {

    const emp_sql = `select * from employee where type = 2`;
    
    con.query(emp_sql, (err, emp_result) => {

        if(err){
            console.log(err);
            res.json({
                status: 'error',
                error: err.sqlMessage
            });
        }
        else if(emp_result.length > 0){
            console.log("ok")
            res.json({
                status: 'ok',
                result: emp_result
            });
        }
        else{
            console.log("no hrm")
            res.json({
                status: 'empty',
            });
        }
    })
}

const getDetails = async (req,res) => {
    var selectDetails=[];
    const sqlinsert = "SELECT ID as id,Name as name FROM department where ID>1";
    con.query(sqlinsert,(err,result) => {
        if(err){
            console.log("table error", err);
        }else{
            selectDetails.push(result);
            const sqlinsert = "SELECT ID as id,status as name FROM maritalstatus";
            con.query(sqlinsert,(err,result) => {
                if(err){
                    console.log("table error", err);
                }else{
                    selectDetails.push(result);
                    const sqlinsert = "SELECT ID as id,type as name FROM emptype  where ID>2";
                    con.query(sqlinsert,(err,result) => {
                        if(err){
                            console.log("table error", err);
                        }else{
                            selectDetails.push(result);
                            const sqlinsert = "SELECT ID as id,paygrade as name FROM paygrade";
                            con.query(sqlinsert,(err,result) => {
                                if(err){
                                    console.log("table error", err);
                                }else{
                                    selectDetails.push(result);
                                    const sqlinsert = "SELECT ID as id,status as name FROM empstatus";
                                    con.query(sqlinsert,(err,result) => {
                                        if(err){
                                            console.log("table error", err);
                                        }else{
                                            selectDetails.push(result);
                                            console.log("all data here",selectDetails)
                                            res.send(selectDetails);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

module.exports = {
    postAdminLogin,
    postAddHRM,
    getHRM,
    getDetails
}

// [
//     [0]   RowDataPacket {
//     [0]     ID: 4,
//     [0]     firstname: "'testhr'",
//     [0]     lastname: "'hrmanager'",
//     [0]     birthday: 1990-05-09T18:30:00.000Z,
//     [0]     email: "'hremail@gmail.com'",
//     [0]     salary: 150000,
//     [0]     Joined_date: 2019-04-24T18:30:00.000Z,
//     [0]     nic_number: "'990567773v'",
//     [0]     photo: null,
//     [0]     leave_count: 0,
//     [0]     department: 1,
//     [0]     maritalStatus: 2,
//     [0]     address: 6,
//     [0]     type: 2,
//     [0]     paygrade: 2,
//     [0]     empStatus: 1,
//     [0]     user_Id: 6,
//     [0]     emergency_contact: 4
//     [0]   }
//     [0] ]

// {
//     firstname: 'testhr',
//     lastname: 'hrmanager',
//     birthday: '1990.05.10',
//     email: 'kalana.19@cse.mrt.ac.lk',
//     salary: 150000,
//     Joined_date: '2019.04.25',
//     nic_number: '990567761v',
//     department: 1,
//     maritalStatus: 2,
//     address: {
//         Line1: 'hrline1',
//         Line2: 'hrline2',
//         City: 'hrcity',
//         District: 'hrdis',
//         Postal_Code: '290B'
//     },
//     type: 2,
//     paygrade: 2,
//     empStatus: 1,
//     user: {
//         username: 'hruser',
//         password: 'hrpassword'
//     },
//     emergency_contact: {
//         Name: 'hremerge',
//         phone_number: '0766755431',
//         Relationship: 'uncle'
//     },
//     phonenumber: [
//         '0756746745',
//         '0715643564'
//     ]
// }
// let sql1    = `SELECT count(employee.ID) as count FROM employee left outer join user on employee.user_Id = user.ID WHERE type = 2 or email = "${con.escape(data.email)}" or employee.nic_number = "${con.escape(data.nic_number)}" or user.username = "${con.escape(username)}"`;