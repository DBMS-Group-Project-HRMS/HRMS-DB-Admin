const con = require('../database/db_helper');
const auth = require('../middleware/auth');
const enc = require('../middleware/encryptionHandler');

const postAdminLogin = (req, res) => {

    const username = req.body.username;
    const password = req.body.password;    

    con.query("SELECT * FROM Employee left outer join EmpType on Employee.type = EmpType.ID left outer join User on Employee.user_Id = User.ID WHERE EmpType.type = 'Admin' LIMIT 1", function (err, result) {
        if (err){
            console.log(err);
        }
        else{

            // decrypt and verify username and password
                // send error if not verified
            // else send user data along with encoded token

            if(result.length < 1){
                req.json({
                    status: 'error',
                    error: "Failed to fetch data!"
                });
            }
            else{

                const user = result[0];
                const id = user.ID;

                const hashed_username = user.username;
                const hashed_password = user.password;

                // const auth_username = await enc.checkEncryptedCredential(username, hashed_username);
                // const auth_password = await enc.checkEncryptedCredential(password, hashed_password);
                
                // if(auth_username && auth_password){
                //     res.send({
                //         token: auth.createToken(id),
                //         user: user
                //     });
                // }

                if(hashed_username === username && hashed_password === password){
                    res.json({
                        status: 'ok',
                        token: auth.createToken(id),
                        user: user
                    });
                }
                else{
                    res.json({
                        status: 'error',
                        error: "Authentication error!"
                    });
                }

            }
        }
    });
}

const postAddHRM = (req, res) => {

    let data = req.body;
    let admin_password = data.admin_password;

    con.query('select password from user where ID = 1 limit 1', (err, result) => {

        if(err){
            console.log(err);
        }
        else{

            let hashed_admin_password = result[0].password;
            // const auth_password = await enc.checkEncryptedCredential(admin_password, hashed_admin_password);
            // if(auth_password){

            if(hashed_admin_password === admin_password){
                // email unique
                //username unique and encrypted
                //password encrypted

                // let hashed_username = await enc.encryptCredential(data.user.username);
                // let hashed_password = await enc.encryptCredential(data.user.password);

                let hashed_username = data.user.username;
                let hashed_password = data.user.password;

                let sql1    = 'SELECT count(employee.ID) as count FROM employee left outer join user on employee.user_Id = user.ID WHERE type = 2 or email = ' + con.escape(data.email) + 'or user.username = ' + con.escape(hashed_username);
                con.query(sql1, (err, result) => {

                    if(err){
                        console.log(err);
                    }
                    else if(result[0].count > 0){
                        res.json({
                            status: 'error',
                            error: "HR Manager/email/username already exists!"
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
                    let user_values = [hashed_username, hashed_password];

                    let emerg_sql = 'insert into EmergencyContact (name, phone_number, Relationship) values (?)'
                    let emerge_values = [
                        con.escape(data.emergency_contact.Name),
                        con.escape(data.emergency_contact.phone_number),
                        con.escape(data.emergency_contact.Relationship)
                    ]

                    let sql2 = address_sql + user_sql + emerg_sql;
                    let values = [address_values, user_values, emerge_values];

                    // let sql2 = user_sql;
                    // let values = [user_values];

                    con.query(sql2, values, (err, result) => {
                        if(err){
                            console.log(err);
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
            else{
                res.json({
                    status: 'error',
                    error: "password incorrect!"
                });
            }
        }
    })


}

module.exports = {
    postAdminLogin,
    postAddHRM
}

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