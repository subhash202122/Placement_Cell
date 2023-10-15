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
// module.exports.addStudentPage = async function (req, res) {
//     return res.render('addStudent', {
//         title: "Student"
//     })
// }
// module.exports.addStudent = async function (req, res) {
//     try {
//         if (!validator.isEmail(req.body.email)) {
//             req.flash('error' ,'Enter valid Email !!');
//             return res.redirect('back');
//         } else {
//             const presentStudent = await Student.findOne({ email: req.body.email });
//             if (presentStudent) {
//                 req.flash('error' ,'Student Already Present!!');
//                 return res.redirect('back');
//             } else {
//                 const addStudent = await Student(req.body);
//                 await addStudent.save();
//                 req.flash('success' , 'Student Added Successfully !!');
//                 return res.redirect('/employee/dashboard');
//             }
//         }
//     } catch (error) {
//         return res.send('Error in adding student');
//     }
// }
module.exports.addStudent = async function (req, res) {
  try {
    if (!validator.isEmail(req.body.email)) {
      req.flash('error', 'Enter a valid Email !!');
      return res.redirect('back');
    } else {
      const presentStudent = await Student.findOne({ email: req.body.email });
      if (presentStudent) {
        req.flash('error', 'Student Already Present!!');
        return res.redirect('back');
      } else {
        const addStudent = await Student.create(req.body);  // Use create() to create a new student
        req.flash('success', 'Student Added Successfully !!');
        return res.redirect('/employee/dashboard');
      }
    }
  } catch (error) {
    console.error('Error in adding student:', error);
    return res.send('Error in adding student');
  }
};

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
