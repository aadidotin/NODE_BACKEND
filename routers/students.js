const express = require("express");
const route = express.Router();
const conn = require('../database/mysql');
const constant = require('../utils/index');
const authMiddleware = require("../middleware/userAuth");

// Add Students API
route.post("/add-student", authMiddleware, (req, res) => {
    let err = [];
    const userData = req.context;

    const { std_name, std_father, std_dob, std_gender, std_address, std_contact, std_aadhar, std_education, std_state, std_city, std_pincode, enroll_id, reg_date, course, course_fee, branch } = req.body;

    if (!std_name || std_name == "") err.push("Please Enter Student Name");
    if (!std_father || std_father == "") err.push("Please Enter Student's Father Name");
    if (!std_dob || std_dob == "") err.push("Please Add Student's Date of Birth");
    if (!std_gender || std_gender == "") err.push("Please Choose Gender");
    if (!std_address || std_address == "") err.push("Please Enter Student's Address");
    if (!std_contact || std_contact == "") err.push("Please Enter Student's Contact No.");
    if (!std_aadhar || std_aadhar == "") err.push("Please Enter Student's Aadhar No.");
    if (!std_education || std_education == "") err.push("Please Choose Student's Qualification");
    if (!std_state || std_state == "") err.push("Please Choose Student's State");
    if (!std_city || std_city == "") err.push("Please Choose Student's City");
    if (!std_pincode || std_pincode == "") err.push("Please Enter Student's Pincode");
    if (!enroll_id || enroll_id == "") err.push("Enrollment Id is Empty");
    if (!reg_date || reg_date == "") err.push("Please Add Registration Date");
    if (!course || course == "") err.push("Please Choose Course");
    if (!course_fee || course_fee == "") err.push("Please Enter Course Fees");
    if (!branch || branch == "") err.push("Please Choose Branch");

    if (err.length > 0) {
        res.send({ success: false, errors: { error: err[0] } });
    }
    else {
        conn.query("SELECT aadhar_id FROM `admission` WHERE `enroll_no` = ? AND `branch` = ? ", [enroll_id, branch], async (error, result) => {
            try {
                if (error) throw new Error(error.sqlMessage);
                console.log(result);

                if (result.length !== 0) {
                    res.send({
                        success: false,
                        errors: {
                            error: "Student Already Exists"
                        }
                    });
                }
                else {
                    const studenData = JSON.stringify({ name: std_name, father_name: std_father, dob: std_dob, gender: std_gender, address: std_address, contact: std_contact, qualify: std_education, city: std_city, state: std_state, pin: std_pincode });

                    const logs = JSON.stringify([{ addeddate: constant.todaydatetime, description: "New Student Registered", action_by: userData.unique_id }])

                    // $student_data = json_encode(['name' => $std_name, 'father_name' => $std_father, 'dob' => $std_dob, 'gender' => $std_gender, 'address' => $std_address, 'contact_num' => $std_contact, 'qualify' => $std_qualify, 'city' => $std_city, 'state' => $std_state, 'pin' => $std_pin, 'image' => $image_data]);

                    // status = 1;

                    if (err.length > 0) {
                        res.send({ success: false, errors: { error: err[0] } })
                    }
                    else {
                        conn.query("INSERT INTO `admission` (`unique_id`,`enroll_no`,`aadhar_id`,`student_data`,`course`,`date_of_join`,`branch`,`total_fee`,`status`,`logs`,`reg_by`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                            constant.uniqueid,
                            enroll_id,
                            std_aadhar,
                            studenData,
                            course,
                            reg_date,
                            branch,
                            course_fee,
                            1,
                            logs,
                            userData.unique_id
                        ], (error, result) => {
                            console.log("final ---- ", error, result);
                            if (error) throw new Error(error.sqlMessage);

                            res.status(200).send({ success: true, message: "Student Added Successfully" });
                        })
                    }

                    // console.log(hPassword);
                    // let comp = bcrypt.compareSync(password, hPassword)
                    // console.log(comp);

                }
            } catch (error) {
                res.status(417).send(error.message)
            }
        })
    }
});


module.exports = route;
