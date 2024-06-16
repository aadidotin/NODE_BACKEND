const express = require("express");
const route = express.Router();
const bcrypt = require("bcryptjs");
const conn = require('../database/mysql');
const constant = require('../utils/index');

route.get("/", (req, res) => {
    res.send({ success: true, message: "This Is main route" });
});

// SignIN API
route.post("/login", (req, res) => {
    res.send({ success: true, message: "This Is main route" });
});

// SignUP API
route.post("/signup", async (req, res) => {
    res.send(req.body)
    let { fullname, email, password } = req.body;

    let gSalt = await bcrypt.genSalt(10);
    let hPassword = await bcrypt.hash(password, gSalt);

    conn.query("SELECT email FROM registration WHERE email = ?", [email], (error, result, field) => {
        try {
            if (error) {
                throw error
            }
            else {
                const pdata = JSON.stringify({ name: fullname, image: [], img_check: false, contact_num: "" });
                const obj_password = JSON.stringify({ login_pass_key: password, login_password: hPassword, password_changed: false, account_activation: true, changed_password_date: "", otp: "", account_created_date: constant.todaydatetime });

                const logs = JSON.stringify([{ addeddate: constant.todaydatetime, "description": "New Superadmin Added" }]);

                conn.query("INSERT INTO registration (`unique_id`,`account_type`,`email`,`p_data`,`login_info`,`status`,`logs`) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [constant.uniqueid, 1, email, pdata, obj_password, 1, logs],
                    (error, result) => {
                        res.status(200).send({ success: true, message: "User Added Successfully" })
                    }
                )
            }
        } catch (error) {
            res.status(500).send({ success: false, errors: { error: error.message } })
        }

        console.log(error, result, field);
    })

    // console.log(hPassword);
    // let comp = bcrypt.compareSync(password, hPassword)
    // console.log(comp);
});

module.exports = route;
