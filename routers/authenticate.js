const express = require("express");
const route = express.Router();
const bcrypt = require("bcryptjs");
const conn = require('../database/mysql');
const constant = require('../utils/index');
const jwt = require('jsonwebtoken');

route.get("/", (req, res) => {
    res.send({ success: true, message: "This Is main route" });
});

// SignIN API
route.post("/login", (req, res) => {
    let err = [];
    let { email, password } = req.body;

    if (email == undefined || email == null || email.trim() == '') err.push("Email is Empty");
    if (!constant.validateEmail(email)) err.push("Please Enter a Valid Email Address");
    if (password == undefined || password == null || password.trim() == '') err.push("Password is Empty");

    if (err.length > 0) {
        res.status(401).send({ success: false, errors: { error: err[0] } });
    }
    else {
        conn.query("SELECT login_info, p_data, email, account_type  FROM registration WHERE email = ? AND status = 1", [email], async (error, result) => {
            try {
                if (result.length == 0) {
                    res.status(401).send({
                        success: false,
                        errors: {
                            error: "Account Not Registered"
                        }
                    });
                }
                else {
                    let password_object = JSON.parse(result[0]?.login_info);
                    let p_data = JSON.parse(result[0]?.p_data);
                    let db_password = password_object?.login_password;

                    if (password_object?.account_activation == false) {
                        err.push("Account is not Active");
                    }
                    if (!bcrypt.compareSync(password, db_password)) {
                        err.push("You have Entered Wrong Password");
                    }

                    if (err.length > 0) {
                        res.status(401).send({ success: false, errors: { error: err[0] } })
                    }
                    else {
                        const authtoken = jwt.sign({ email: result[0]?.email, name: p_data?.name, account_type: result[0]?.account_type }, process.env.JWT_SECRET_CODE);
                        res.status(200).send({
                            success: true,
                            message: "Logged In Successfully",
                            authtoken: authtoken
                        })
                    }

                    // console.log(hPassword);
                    // let comp = bcrypt.compareSync(password, hPassword)
                    // console.log(comp);

                }
            } catch (error) {
                res.status(503).send({ success: false, errors: { error: error.message } })
            }
        })
    }
});

// SignUP API
route.post("/signup", async (req, res) => {
    let err = [];
    let { fullname, email, password } = req.body;

    if (fullname == undefined || fullname == null || fullname.trim() == '') err.push("Name is Empty");
    if (email == undefined || email == null || email.trim() == '') err.push("Email is Empty");
    if (!constant.validateEmail(email)) err.push("Please Enter a Valid Email Address");
    if (password == undefined || password == null || password.trim() == '') err.push("Password is Empty");
    if (password.length < 8) err.push("Password must be atleast 8 Characters");

    if (err.length > 0) {
        res.status(401).send({ success: false, errors: { error: err[0] } });
    }
    else {
        conn.query("SELECT email FROM registration WHERE email = ?", [email], async (error, result) => {
            try {
                if (result.length > 0) {
                    res.status(417).send({ success: false, errors: { error: "User Already Exist" } })
                }
                else {
                    let gSalt = await bcrypt.genSalt(10);
                    let hPassword = await bcrypt.hash(password, gSalt);
                    // let anotherWay = await bcrypt.hash(password, 10);    // Here We can add a number OR string on the place of salt and that will auto generate salt and hash it.

                    const pdata = JSON.stringify({ name: fullname, image: [], img_check: false, contact_num: "" });
                    const obj_password = JSON.stringify({ login_pass_key: password, login_password: hPassword, password_changed: false, account_activation: true, changed_password_date: "", otp: "", account_created_date: constant.todaydatetime });

                    const logs = JSON.stringify([{ addeddate: constant.todaydatetime, "description": "New Superadmin Added" }]);

                    conn.query("INSERT INTO registration (`unique_id`,`account_type`,`email`,`p_data`,`login_info`,`status`,`logs`) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [constant.uniqueid, 1, email, pdata, obj_password, 1, logs],
                        (error, result) => {
                            const authtoken = jwt.sign({ email, name: fullname, account_type: 1 }, process.env.JWT_SECRET_CODE);
                            res.status(200).send({
                                success: true,
                                message: "User Added Successfully",
                                authtoken
                            })
                        }
                    )
                }
            } catch (error) {
                res.status(503).send({ success: false, errors: { error: error.message } })
            }
        })
    }
});

module.exports = route;
