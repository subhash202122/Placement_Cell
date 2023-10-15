const validator = require('validator');
const convertor = require('objects-to-csv');
const Student = require('../models/student');
const Interview = require('../models/interview');
const Result = require('../models/result');
const fs = require('fs');
// employee dashboard list
module.exports.dashboard = async function (req, res) {
    const studentList = await Student.find({});
    return res.render('employeeDashboard', {
        title: "EmployeeDashboard",
        studentList: studentList
    })
}

// add student page
module.exports.addStudentPage = async function (req, res) {
    return res.render('addStudent', {
        title: "Student"
    })
}
module.exports.addStudent = async function (req, res) {
    try {
        if (!validator.isEmail(req.body.email)) {
            req.flash('error' ,'Enter valid Email !!');
            return res.redirect('back');
        } else {
            const presentStudent = await Student.findOne({ email: req.body.email });
            if (presentStudent) {
                req.flash('error' ,'Student Already Present!!');
                return res.redirect('back');
            } else {
                const addStudent = await Student(req.body);
                await addStudent.save();
                req.flash('success' , 'Student Added Successfully !!');
                return res.redirect('/employee/dashboard');
            }
        }
    } catch (error) {
        return res.send('Error in adding student');
    }
}

module.exports.downloadData = async function (req, res) {
    const studentList = await Student.find({});
    const dataPresent = [];
    for (var i = 0; i < studentList.length; i++) {
        const student = studentList[i];
        for (var j = 0; j < student.interviews.length; j++) {
            const id = student.interviews[j];
            const interviewData = await Interview.findById(id);
            //find result
            var result = "On Hold";
            const resultIndex = interviewData.result.indexOf(student.id);
            if (resultIndex != -1) {
                const resultData = await Result.find({ studentId: interviewData.result[resultIndex] });
                for (var k = 0; k < resultData.length; k++) {
                    if (resultData[k].interviewId == interviewData.id) {
                        result = resultData[k].result;
                        break;
                    }
                }
            }
            const list = {
                StudentId: student.id,
                Batch: student.batch,
                Name: student.name,
                Email: student.email,
                Status: student.status,
                College: student.college,
                DSA: student.DSA_FinalScore,
                WEBD: student.WebD_FinalScore,
                REACT: student.React_FinalScore,
                CompanyName: interviewData.companyName,
                InterviewDate: interviewData.date.toString().substring(4, 15),
                Result: result
            };
            dataPresent.push(list);
        }
    }
    const csv = new convertor(dataPresent);
    await csv.toDisk('./studentData.csv');
    return res.download('./studentData.csv', () => {
        //for deleting file
        fs.unlinkSync('./studentData.csv');
    });
}
// const Company = require("../models/company");
// const Student = require("../models/student");

// module.exports.home = async function (req, res) {
//   const data = await Student.find({});
//   return res.render("home", {
//     title: "Home Page",
//     student_list: data,
//   });
// };
// module.exports.studentForm = function (req, res) {
//   return res.render("create_student", {
//     title: "Create Student",
//   });
// };

// module.exports.interviewInfo = function (req, res) {
//   return res.render("interview_info", {
//     title: "Interviews Info",
//   });
// };

// module.exports.createStudent = async function (req, res) {
//   const newStudent = await Student.create(req.body);
//   res.redirect("/");
// };

// module.exports.deleteStudent = async function (req, res) {
//   const id = req.query.id;

//   await Company.updateMany(
//     {},
//     {
//       $pull: {
//         students: { student: id },
//       },
//     },
//     { multi: true }
//   );
//   // const companies = await Company.find({});

//   // for (let company of companies) {
//   //   if (company && company.students.length > 0) {
//   //     const filteredStudents = company.students.filter(
//   //       (student) => student.student != id
//   //     );
//   //     company.students = filteredStudents;
// //   //     company.save();
// //   //   }
// //   // }
// //   await Student.findByIdAndDelete(id);
// //   res.redirect("/");
// // };

// // module.exports.studentInfo = async function (req, res) {
// //   const id = req.query.id;
// //   const data = await Student.findById(id);

// //   if (data) {
// //     return res.render("student_info", {
// //       title: "Student Info",
// //       studentData: data,
// //     });
// //   }
// //   return res.redirect("back");
// // };

// // module.exports.updateStudent = async function (req, res) {
// //   const {
// //     id,
// //     name,
// //     batch,
// //     college,
// //     status,
// //     dsa_score,
// //     webdev_score,
// //     react_score,
// //   } = req.body;
// //   await Student.findByIdAndUpdate(id, {
// //     name,
// //     batch,
// //     college,
// //     status,
// //     dsa_score,
// //     webdev_score,
// //     react_score,
// //   });
// //   return res.redirect("/");
// // };
// const Company = require("../models/company");
// const Student = require("../models/student");

// module.exports.home = async function (req, res) {
//   try {
//     const data = await Student.find({});
//     return res.render("home", {
//       title: "Home Page",
//       student_list: data,
//     });
//   } catch (error) {
//     return res.send('Error in fetching student data');
//   }
// };

// module.exports.studentForm = function (req, res) {
//   return res.render("create_student", {
//     title: "Create Student",
//   });
// };

// module.exports.interviewInfo = function (req, res) {
//   return res.render("interview_info", {
//     title: "Interviews Info",
//   });
// };

// module.exports.createStudent = async function (req, res) {
//   try {
//     const newStudent = await Student.create(req.body);
//     return res.redirect("/");
//   } catch (error) {
//     return res.send('Error in creating student');
//   }
// };

// module.exports.deleteStudent = async function (req, res) {
//   try {
//     const id = req.query.id;

//     await Company.updateMany(
//       {},
//       {
//         $pull: {
//           students: { student: id },
//         },
//       },
//       { multi: true }
//     );

//     await Student.findByIdAndDelete(id);
//     return res.redirect("/");
//   } catch (error) {
//     return res.send('Error in deleting student');
//   }
// };

// module.exports.studentInfo = async function (req, res) {
//   try {
//     const id = req.query.id;
//     const data = await Student.findById(id);

//     if (data) {
//       return res.render("student_info", {
//         title: "Student Info",
//         studentData: data,
//       });
//     }
//     return res.redirect("back");
//   } catch (error) {
//     return res.send('Error in fetching student info');
//   }
// };

// module.exports.updateStudent = async function (req, res) {
//   try {
//     const {
//       id,
//       name,
//       batch,
//       college,
//       status,
//       dsa_score,
//       webdev_score,
//       react_score,
//     } = req.body;
//     await Student.findByIdAndUpdate(id, {
//       name,
//       batch,
//       college,
//       status,
//       dsa_score,
//       webdev_score,
//       react_score,
//     });
//     return res.redirect("/");
//   } catch (error) {
//     return res.send('Error in updating student');
//   }
// };
