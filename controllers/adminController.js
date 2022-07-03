const con = require('../database/db_helper');
const auth = require('../middleware/auth');
const enc = require('../middleware/encryptionHandler');

const postAdminLogin = async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    let sql1 = `SELECT * FROM Employee left outer join EmpType on Employee.type = EmpType.ID left outer join User on Employee.user_Id = User.ID WHERE EmpType.type = 'Admin' and user.username = "${con.escape(username)}" LIMIT 1`

    con.query(sql1, async function (err, result) {

        if (err){
            console.log(err);
            res.json({
                status: 'error',
                error: err.sqlMessage
            });
        }
        else{

            if(result.length < 1){
                console.log("no user");
                res.json({
                    status: 'error',
                    error: "Authentication error!"
                });
            }
            else{

                const user = result[0];

                const hashed_password = user.password;
                const auth_password = await enc.checkEncryptedCredential(password, hashed_password);
                
                if(auth_password){
                    res.send({
                        token: auth.createToken(),
                        user: user
                    });
                }
                else{
                    console.log("password error");
                    res.json({
                        status: 'error',
                        error: "Authentication error!"
                    });
                }

            }
        }
    });
}

const postAddHRM = async (req, res) => {

    let data = req.body;

    let username = data.user.username;
    let hashed_password = await enc.encryptCredential(data.user.password);

    let sql1    = `SELECT count(employee.ID) as count FROM employee left outer join user on employee.user_Id = user.ID WHERE or email = "${con.escape(data.email)}" or employee.nic_number = "${con.escape(data.nic_number)}" or user.username = "${con.escape(username)}"`;
    con.query(sql1, (err, result) => {

        if(err){
            console.log(err);
            res.json({
                status: 'error',
                error: err.sqlMessage
            });
        }
        else if(result[0].count > 0){
            res.json({
                status: 'error',
                error: "Email, username or NIC already exists!"
            });
        }

        let address_sql = 'insert into Address (Line1, Line2, City, District, Postal_Code) values (?);';
        let address_values = [
            con.escape(data.address.Line1),
            con.escape(data.address.Line2),
            con.escape(data.address.City),
            con.escape(data.address.District),
            con.escape(data.address.Postal_Code)
        ];

        let user_sql = 'insert into User (username, password) values (?);';
        let user_values = [con.escape(username), hashed_password];

        let emerg_sql = 'insert into EmergencyContact (name, phone_number, Relationship) values (?)'
        let emerge_values = [
            con.escape(data.emergency_contact.Name),
            con.escape(data.emergency_contact.phone_number),
            con.escape(data.emergency_contact.Relationship)
        ]

        let sql2 = address_sql + user_sql + emerg_sql;
        let values = [address_values, user_values, emerge_values];

        con.query(sql2, values, (err, result) => {
            if(err){
                console.log(err);
                res.json({
                    status: 'error',
                    error: err.sqlMessage
                });
            }
            else{

                let address_id = result[0].insertId;
                let user_id = result[1].insertId;
                let emerge_id = result[2].insertId;

                let emp_sql = 'insert into Employee (firstname, lastname, birthday, email, salary, Joined_date, nic_number, department, maritalStatus, address, type, paygrade, empStatus, user_id, emergency_contact) values (?)';
                let emp_values = [
                    con.escape(data.firstname), 
                    con.escape(data.lastname), 
                    data.birthday, 
                    con.escape(data.email), 
                    con.escape(data.salary), 
                    data.Joined_date, 
                    con.escape(data.nic_number), 
                    data.department, 
                    data.maritalStatus, 
                    address_id, 
                    data.type, 
                    data.paygrade, 
                    data.empStatus, 
                    user_id, 
                    emerge_id
                ];

                con.query(emp_sql, [emp_values], (err, result) => {

                    if(err){
                        console.log(err);
                        res.json({
                            status: 'error',
                            error: err.sqlMessage
                        });
                    }
                    else{

                        let emp_id = result.insertId;

                        let phone_sql = 'insert into PhoneNumber (emp_ID, phone_number) values ?';
                        let phone_values = [];

                        let phone_numbers = data.phonenumber;
                        for (let i = 0; i < phone_numbers.length; i++) {
                            phone_values.push([emp_id, phone_numbers[i]]);
                        }

                        con.query(phone_sql, [phone_values], (err, result) => {
                            if(err){
                                console.log(err);
                                res.json({
                                    status: 'error',
                                    error: err.sqlMessage
                                });
                            }
                            else{
                                console.log(result);
                                res.json({
                                    status: 'ok',
                                    result: result
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

module.exports = {
    postAdminLogin,
    postAddHRM,
    getHRM,
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