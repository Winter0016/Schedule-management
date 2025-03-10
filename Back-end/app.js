// app.js
require('dotenv').config();

const multer = require('multer');
const path = require('path');

const bcrypt = require("bcrypt");
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const nodemailer = require('nodemailer');

const mongoose = require("mongoose")
const connectDB = require("./config/dbConn");

const app = express();

const speech = require('@google-cloud/speech');
const fs = require('fs');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path; // Use ffprobe-static to get the path
const ffmpeg = require('fluent-ffmpeg');

const secretKey = 'your_secret_key'; // Replace with your actual secret key

const Employee = require("./model/Employee");
const User = require("./model/User");
const UserPlan = require("./model/Plans");
const Days = require("./model/Days")
const Months = require("./model/Month")

const SECRET_KEY = 'qwertyuiopasdfghjkl123';



// app.use(cors());

app.use(cors({
    origin: 'http://localhost:3001', // Allow only frontend port 3001
    credentials: true                // Allow cookies to be sent with requests
}));


//connect to mongodb
console.log(process.env.DATABASE_URI)
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());
const axios = require('axios');


// Mock user authentication
app.get('/greeting', (req, res) => {
    res.json({ message: "Bon Jour My Love!" })
})


// const allow = [ROLE_LIST.User,ROLE_LIST.Admin];
// console.log(allow)


const verifyJwt = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ "Error": "Couldn't find your JWT!" });
    console.log("autheaders :", authHeader);
    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return (res.status(403).res.json({ "message": "The token is not matched!" }));
            req.user = decoded.Userinfo.username;
            req.roles = decoded.Userinfo.roles;
        }
    )
}
const verifyrole = (...allowedrole) => {
    return (req, res, next) => {
        if (!req?.roles) return res.status(401).json({ "message": "You don't have any permission." })
        const allowedrolearray = [...allowedrole];
        // const temp = req.roles.map(role => allowedrolearray.includes(role))
        // console.log(temp);
        const result = req.roles.map(role => allowedrolearray.includes(role)).find(val => val === true);
        // console.log(`result of role`,result);
        if (!result) return res.status(401).json({ "message": "You don't have permission for this action" })
        next();
    }
}





app.post('/auth/register', async (req, res) => {
    const { username, password, email } = req.body;

    // Check if all fields are provided
    if (!username || !password || !email) {
        return res.status(400).json({ message: "Username, Email, and Password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
        return res.status(409);
    }

    try {
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user but set 'verified' to false initially
        const newUser = new User({
            username: username,
            password: hashedPassword,
            email: email,
            verified: false, // Add verified field to track email verification status
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Generate a verification token
        const verificationToken = jwt.sign({ userId: savedUser._id, email }, process.env.VERIFY_KEY, { expiresIn: '1d' });

        // Send verification email
        const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
        await sendVerificationEmail(savedUser.email, verificationLink);

        return res.status(201).json(`User "${username}" created successfully! Please check your email to verify your account.`);
    } catch (err) {
        console.error(err);
        return res.status(500).json("Error creating user");
    }
});

app.post('/auth/check-username', async (req, res) => {
    // console.log(`checking username`)
    const { username } = req.body; // Get username from the body

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    const userExists = await User.findOne({ username });
    res.json({ exists: !!userExists });
});
app.post('/auth/check-email', async (req, res) => {
    // console.log(`checking username`)
    const { email } = req.body; // Get username from the body

    if (!email) {
        return res.status(400).json({ message: "Username is required" });
    }

    const emailexists = await User.findOne({ email });
    return res.json({ exists: !!emailexists });
});
// Function to send the verification email
const sendVerificationEmail = async (email, verificationLink) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or any other email provider
        auth: {
            user: 'chauquangphuc2604.2604@gmail.com',
            pass: process.env.NODEMALPASS,
        },
    });

    const mailOptions = {
        from: 'chauquangphuc2604.2604@gmail.com',
        to: email,
        subject: 'Verify Your Email',
        html: `<p>Click the following link to verify your email: <a href="${verificationLink}">Verify Email</a></p>`,
    };

    await transporter.sendMail(mailOptions);
};

app.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.VERIFY_KEY);
        const userId = decoded.userId;

        // Find the user by ID and update their verified status
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send('Invalid token.');
        }

        // Update user as verified
        user.verified = true;
        await user.save();

        return res.status(200).send('Email verified successfully!');
    } catch (error) {
        console.error(error);
        return res.status(400).send('Invalid or expired token.');
    }
});

app.post("/reset-password", async (req, res) => {
    // console.log("running reset password")
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) {
        return res.json("No user has this email.")
    } else {
        // console.log("found user")
        const verificationToken = jwt.sign({ userId: user._id }, process.env.VERIFY_KEY, { expiresIn: '1d' });
        const verificationLink = `http://localhost:3001/reset-password?token=${verificationToken}`
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or any other email provider
            auth: {
                user: 'chauquangphuc2604.2604@gmail.com',
                pass: process.env.NODEMALPASS,
            },
        });

        const mailOptions = {
            from: 'chauquangphuc2604.2604@gmail.com',
            to: email,
            subject: 'Reset your password',
            html: `<p>Click the following link to reset your password: <a href="${verificationLink}">Reset Password</a></p>`,
        };

        await transporter.sendMail(mailOptions);
        return res.status(201).json("We has sent an link for password reset,please check your email");
    }
})
app.post("/verify-token", async (req, res) => {
    const { token } = req.body;
    // console.log("checking token !")
    try {
        const decoded = jwt.verify(token, process.env.VERIFY_KEY);
        const userId = decoded.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ message: "Token is Invalid!" });
        }
        await user.save();
        // console.log("Token is valid")
        return res.json({ message: "Token is valid", username: user.username });
    } catch (error) {
        console.log(error);
        return res.json({ message: "Token is Invalid or Expired!" })
    }
})
app.post("/change-password", async (req, res) => {
    const { password, username } = req.body;
    const Founduser = await User.findOne({ username: username }).exec();
    try {
        const bcryptpassword = await bcrypt.hash(password, 10);
        Founduser.password = bcryptpassword;
        await Founduser.save();
        return res.json("Password changed,you now can login back");
    } catch (error) {
        console.log(error);
        return res.json("Error at changing password!");
    }
})


app.post("/add-plan", async (req, res) => {
    const { username, name, timebegin } = req.body;
    try {
        const userplanexist = await UserPlan.findOne({ username: username }).exec();
        if (userplanexist) {
            userplanexist.plans.push({
                name: name,
                progress: null,
                time: null,
                timebegin: timebegin,
            });

            await userplanexist.save(); // Save after updating the plans array

            res.json("Plan added successfully!");
        } else {
            const founduser = await User.findOne({ username: username }).exec();
            const newuserplan = await UserPlan.create({
                username: username,
                plans: [
                    {
                        name: name,
                        progress: null,
                        time: null,
                    }
                ],
            })
            await newuserplan.save();
            return res.json("Created plan successfully!")
        }
    } catch (error) {
        console.log(error);
        return res.json(error.message)
    }
})

app.post("/plan", async (req, res) => {
    const { username } = req.body;
    try {
        const founduser = await UserPlan.findOne({ username: username }).exec();
        if (!founduser) {
            return res.json("");
        }
        res.json({ plans: founduser.plans }); // Ensure response is sent only once
    } catch (error) {
        console.log(error);
        res.json(error.message); // Send an error response only if needed
    }
});
app.post("/update-task", async (req, res) => {
    const { username, planname, nameac, acdescription, color, textcolor, modifyacname, timestart, timeend, deadline } = req.body;
    try {
        const findUser = await UserPlan.findOne({ username: username }).exec();

        if (!findUser) {
            return res.status(404).json("User not found");
        }

        const findplan = findUser.plans.find(plan => plan.name === planname);

        if (!findplan) {
            return res.status(404).json("Plan not found");
        }

        const existtask = findplan.my_task.find(task => task.name === nameac);

        if (modifyacname) {
            if (!existtask) {
                console.log(`task not exist in modification : ${nameac}`)
                return res.status(404).json("Task not found for modification");
            }
            existtask.description = acdescription;
            existtask.color = color;
            existtask.textcolor = textcolor;
            existtask.timestart = timestart;
            existtask.timeend = timeend;
            existtask.deadline = deadline;
            existtask.name = modifyacname;
            await findUser.save(); // Ensure to save after updating the task
            return res.status(200).json("Updated task successfully!");
        }

        if (existtask) {
            return res.status(400).json("The task already exists!");
        }

        findplan.my_task.push({ name: nameac, description: acdescription, color: color, textcolor: textcolor, timestart: timestart, timeend: timeend, deadline: deadline });
        await findUser.save();
        return res.status(200).json("Added task successfully!");
    } catch (error) {
        console.log(error);
        res.status(500).json("Error at update-task");
    }
})

app.post("/delete-task", async (req, res) => {
    const { username, planname, mytaskid } = req.body;

    try {
        const updatedUserPlan = await UserPlan.findOneAndUpdate(
            { username: username, "plans.name": planname }, // Find the user, plan, and specific daily entry
            { $pull: { "plans.$.my_task": { _id: mytaskid } } }, // Remove the activity with the matching _id
            { new: true }  // Return the updated document
        );

        if (!updatedUserPlan) {
            return res.status(404).json("Activity not found");
        }

        res.json("Deleted activity successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json("Error deleting activity");
    }
});

app.post("/deletefinishedtask", async (req, res) => {
    const {username,planname,finishedtask_id} = req.body;
    try{
        const userPlan = await UserPlan.findOne({ username: username }).exec();
        if (!userPlan) {
            return res.status(404).json("User  not found");
        }

        // Check if the plan exists
        const userPlanData = userPlan.plans.find(p => p.name === planname);
        if (!userPlanData) {
            return res.status(404).json("Plan not found");
        } 
        userPlanData.finished_task = userPlanData.finished_task.filter(myfinishedtask => myfinishedtask._id.toString() !== finishedtask_id.toString());
        await userPlan.save();
        res.json("Delete finished tasks sucessfully!");
    }catch(error){
        console.log(error);
    }
})

app.post("/update-todaytask", async (req, res) => {
    const { username, plan, date, task, changetodaytask } = req.body;
    console.log(`running update-todaytask`)

    try {
        // Check if the user exists
        const userPlan = await UserPlan.findOne({ username: username }).exec();
        if (!userPlan) {
            return res.status(404).json("User not found");
        }

        // Check if the plan exists
        const userPlanData = userPlan.plans.find(p => p.name === plan);
        if (!userPlanData) {
            return res.status(404).json("Plan not found");
        }

        // Check if any entry in todaytask exists
        if (userPlanData.todaytask.length > 0) {
            console.log(changetodaytask)
            if (userPlanData.todaytask[0].currentdate !== date || changetodaytask == true) {
                if (userPlanData.todaytask[0].currentdate !== date) {
                    console.log(`new day buddy`)
                }
                task.forEach((Task) =>{
                    userPlanData.todaytask[0].task.forEach((todaytask)=>{
                        if(todaytask.name === Task.name){
                            Task.status = todaytask.status;
                        }
                    })
                })
                // console.log(`updating`)
                // console.log(`task :${JSON.stringify(task)}`)
                userPlanData.todaytask[0] = { currentdate: date, task: task };
            }
        } else {
            // If no entry exists, create a new entry
            userPlanData.todaytask.push({ currentdate: date, task: task });
        }

        // Save the updated user plan
        await userPlan.save();

        res.json("Today task updated successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).json("Error updating today task");
    }
});


app.post("/update-checkedarray", async (req, res) => {
    const { username, plan, checkedArray, day, month, date, year } = req.body; // checkedArray contains the _id of each task

    try {
        // Check if the user exists
        const userPlan = await UserPlan.findOne({ username: username }).exec();
        if (!userPlan) {
            return res.status(404).json("User  not found");
        }

        // Check if the plan exists
        const userPlanData = userPlan.plans.find(p => p.name === plan);
        if (!userPlanData) {
            return res.status(404).json("Plan not found");
        }

        // Check if todaytask exists
        if (userPlanData.todaytask.length > 0) {
            const todayTask = userPlanData.todaytask[0]; // Get the first todaytask entry
            const my_task = userPlanData.my_task;

            // Update the task array based on checkedArray
            checkedArray.forEach(item => {
                todayTask.task.forEach(todaytask => {
                    if (todaytask.name === item.Name) {
                        todaytask.status = "Finished"; // Update the task status
                        
                        // Push to finished_task if the task is marked as finished
                        if (item.Task === true) { // Adjust this condition based on your data structure
                            if (!userPlanData.finished_task) {
                                userPlanData.finished_task = []; // Initialize if it doesn't exist
                            }
                            const findfinishedtask = my_task.find(mytask => mytask.name === item.Name);
                            userPlanData.finished_task.push({
                                name: item.Name, // Assuming you want to push the name
                                date: `${day}, ${month + 1}/${date}/${year}`,
                                deadline:findfinishedtask.deadline,
                                description: findfinishedtask.description,
                                timestart:findfinishedtask.timestart,
                                timeend:findfinishedtask.timeend,
                                color:findfinishedtask.color,
                                textcolor:findfinishedtask.textcolor
                            });
                            userPlanData.my_task = userPlanData.my_task.filter(mytask => mytask._id.toString() !== findfinishedtask._id.toString());
                        }
                    }
                });
            });

            // Save the updated user plan
            await userPlan.save(); // Save the parent document
        } else {
            return res.status(404).json("No todaytask found for this plan");
        }

        res.json("Checked array updated successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).json("Error updating checked array");
    }
});

app.post("/delete-plan", async (req, res) => {
    const { username, planId } = req.body; // planId is the _id of the plan you want to delete

    try {
        // Find the user's plan and remove the specific plan by its ID
        const updatedUserPlan = await UserPlan.findOneAndUpdate(
            { username: username }, // Find the document by username
            { $pull: { plans: { _id: planId } } }, // Use $pull to remove the plan by _id
            { new: true } // Return the updated document
        );

        // if (!updatedUserPlan) {
        //     return res.status(404).json({ error: 'User or plan not found' });
        // }

        return res.json("Deleted plan");
    } catch (error) {
        console.error(error);
        return res.status(500).json(error.message);
    }
});

app.get("/days", async (req, res) => {
    try {
        const days = await Days.find();
        const months = await Months.find();
        // console.log(days, months)
        return res.json({ "days": days, "months": months });

    } catch (error) {
        console.log(error);
        return res.json("Error at getting days data.")
    }
})

app.post("/delete-activity", async (req, res) => {
    const { username, planname, dailyId, activityId } = req.body;

    try {
        const updatedUserPlan = await UserPlan.findOneAndUpdate(
            { username: username, "plans.name": planname, "plans.daily._id": dailyId },
            { $pull: { "plans.$[].daily.$[].activities": { _id: activityId } } },
            { new: true }
        );

        if (!updatedUserPlan) {
            return res.status(404).json("Activity not found");
        }

        // Find the updated daily entry and update activityCount
        const updatedDaily = updatedUserPlan.plans.find(p => p.name === planname).daily.find(d => d._id.equals(dailyId));
        updatedDaily.activityCount = updatedDaily.activities.length;
        await updatedUserPlan.save(); // Save the updated document

        res.json("Deleted activity successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json("Error deleting activity");
    }
});

app.post("/add-daily", async (req, res) => {
    const { username, planname, day, nameac, acdescription, color, textcolor, modifyacname, timestart, timeend, important } = req.body;
    try {
        const findUser = await UserPlan.findOne({ username: username }).exec();

        if (!findUser) {
            return res.status(404).json("User not found");
        }

        const findplan = findUser.plans.find(plan => plan.name === planname);

        if (!findplan) {
            return res.status(404).json("Plan not found");
        }

        const existingDay = findplan.daily.find(d => d.day === day);

        if (existingDay) {
            const existingActivity = existingDay.activities.find(activity => activity.name === nameac);
            if (!existingActivity) {
                existingDay.activities.push({ name: nameac, description: acdescription, color: color, textcolor: textcolor, timestart: timestart, timeend: timeend, important: important });
            } else {
                if (modifyacname) {
                    existingActivity.name = modifyacname
                }
                existingActivity.description = acdescription;
                existingActivity.color = color;
                existingActivity.textcolor = textcolor;
                existingActivity.timestart = timestart;
                existingActivity.timeend = timeend;
                existingActivity.important = important;
            }
        } else {
            findplan.daily.push({ day, activities: [{ name: nameac, description: acdescription, color: color, textcolor: textcolor, timestart: timestart, timeend: timeend, important: important }], activityCount: 1 });
        }

        // Update activityCount after adding or modifying activities
        const updatedDaily = findplan.daily.find(d => d.day === day);
        updatedDaily.activityCount = updatedDaily.activities.length;
        await findUser.save();

        res.json(`Action Updated!`);
    } catch (error) {
        console.log(error);
        res.status(500).json("Error at adding activity");
    }
});


app.post("/auth/checkrefreshtoken", async (req, res) => {
    const { refreshtoken } = req.body;
    if (refreshtoken) {
        jwt.verify(
            refreshtoken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) return (res.status(403).res.json({ "message": "The token is not matched!" }));
                res.json({ "user": decoded.Userinfo.username })
            }
        )
    }
})

app.post("/auth/login", async (req, res) => {
    const { username, pwd } = req.body;
    if (!username || !pwd) return res.status(400).json("Email and Password are required")
    const Founduser = await User.findOne({ username: username }).exec();
    if (!Founduser) return res.status(401).json("No user Found")
    const match = await bcrypt.compare(pwd, Founduser.password)
    if (match) {
        console.log(match)
        // const USERNAME = Founduser.username;
        // const accessToken = jwt.sign(
        //     {
        //         "Userinfo":{
        //             "username":Founduser.username,
        //         }
        //     },
        //     process.env.ACCESS_TOKEN_SECRET, //5ca2cd
        //     {expiresIn:"60s"},
        // );
        const refreshToken = jwt.sign(
            {
                "Userinfo": {
                    "username": Founduser.username,
                }
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "24d" },
        )
        Founduser.refreshToken = refreshToken;
        const result = await Founduser.save();
        // console.log(result);
        res.cookie("jwt", refreshToken, { httpOnly: false, Samesite: "Strict", maxAge: 7 * 24 * 60 * 60 * 1000, secure: false })
        res.json("Login successfully");
    } else {
        res.json("Wrong password!");
    }
})
app.get("/auth/logout", async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
        return res.json({ "message": "There is no cookie, but we cleared any existing cookie just in case." });
    }

    const refreshTokencheck = cookies.jwt;
    const Founduser = await User.findOne({ refreshToken: refreshTokencheck }).exec();

    if (!Founduser) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
        return res.json({ "message": "There is no user logged in, but we still cleared the cookie!" });
    }
    console.log(`Found 1 user currently logged in : ${Founduser.username}`);
    Founduser.refreshToken = " ";
    const result = await Founduser.save();
    console.log(result);

    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.status(200).json({ "message": `User ${Founduser.username} has logged out` });
});
const today = new Date();
const date = today.getDate();
let days = today.getDay(); // Get the current day number (0 = Sunday, 1 = Monday, etc.)
if (days == 0) {
  days = 7
}
const months = today.getMonth();
const years = today.getFullYear();

// console.log(`${days}, ${months}/${date} ${years}`);
const testingGeminiAPI = async() =>{
    const findUser = await UserPlan.findOne({ username: "Napoleon" }).exec();

    if (!findUser) {
        return res.status(404).json("User not found");
    }

    const findplan = findUser.plans.find(plan => plan.name === "Study plan");
    queryGemini("Khi nào tôi có lịch đá banh?","Napoleon",findplan);
}
// testingGeminiAPI();

const queryGemini = async (userQuery, username, PLANS) => {
    const apikey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apikey}`;

    try {
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: `
Bạn là trợ lý AI giúp người dùng lấy lịch trình và nhiệm vụ hàng ngày của họ, bạn sẽ xưng hô dưới dạng em và gọi người dùng là anh chị. Dưới đây là lịch trình và nhiệm vụ của người dùng ở định dạng JSON:

Trước khi vô câu hỏi tôi cần bạn đặc biệt Lưu ý, không được bỏ qua điều này :
day:1 => thứ hai
day:2 => thứ ba
day:3 => thứ tư
day:4 => thứ năm
day:5 => thứ sáu
day:6 => thứ bảy
day:7 => chủ nhật
### **User's Schedule (JSON)**
\`\`\`json
${JSON.stringify(PLANS, null, 2)}
\`\`\`
Bạn kiểm tra mục daily và my_task trong json data:
- Ở mục daily bạn dựa trên loại "day" để trả lời câu hỏi[
day: 4 // nghĩa là thứ 5(Lưu ý :day:1 là thứ hai, day:2 là thứ ba, day:3 là thứ tư,day:4 là thứ 5, day:5 là thứ sáu, day:6 là thứ bảy, day:7 là chủ nhật),
),
activityCount:3,
activities:[] // các hoạt động trong thứ 5, đây là nơi mà bạn sẽ lấy thông tin cho câu trả lời.
]
- Ở mục my_task,bạn dựa trên loại "deadline" để trả lời câu hỏi:[ {... deadline:3/9 //nghĩa tháng 3 ngày 9}]
- Thời gian thực của Người dùng: day ${days} (Lưu ý :day 1 là thứ hai, day 2 là thứ ba, day 3 là thứ tư,day 4 là thứ 5, day 5 là thứ sáu, day 6 là thứ bảy, day 7 là chủ nhật),) , tháng ${months+1}, ngày ${date}, năm ${years}
- Khi người dùng hỏi vào mốc thứ từ thứ 2 => chủ nhật, dựa vào thời gian thực của người dùng mà tôi cung cấp bạn phải biết thứ đó là tháng mấy ngày mấy. Ví dụ: người dùng hỏi vào mốc chủ nhật tuần này, dựa trên mốc thới gian của người dùng bạn phải biết chủ nhật tuần này là tháng 3 ngày 9. Sau khi nhận biết xong bạn dựa vào dữ liệu của day ở daily có phải là 7 không,nếu đúng thì trích xuất tất cả name trong array activities và deadline của my_task có phải là 3/9 không nếu đúng thì trích xuất name, sau đó gộp hai chúng lại để trả lời người dùng.
- trả lời người dùng bằng tiếng việt như mặt đối mặt, bạn không cần phải cung cấp thông tin trong json data vì người dùng sẽ không biết, chỉ cung cấp nhưng thông tin cần thiết và có sẵn, trả lời ngắn gọn bằng 1 hàng không xuống dòng.
- Câu hỏi của khách hàng là : ${userQuery}`
                        }
                    ]
                }
            ]
        };

        const response = await axios.post(url, requestBody, {
            headers: { "Content-Type": "application/json" },
        });

        console.log(response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response");
        return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    } catch (error) {
        console.error("Error calling Gemini API:", error.response?.data || error.message);
        return "Respond error";
    }
};
app.post("/ask", async (req, res) => {
    const {username,planname,question} = req.body;
    const findUser = await UserPlan.findOne({ username: username }).exec();

    if (!findUser) {
        return res.status(404).json("User not found");
    }
    const findplan = findUser.plans.find(plan => plan.name === planname);
    if(!findplan){
        return res.status(404).json("Plan not found");
    }
    const reply = await queryGemini(question, username, findplan);
    res.json(reply);
  });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'audio/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `received${path.extname(file.originalname)}`); 
    }
});

const upload = multer({ storage: storage });

app.post('/voice-receive', upload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log('File received:', req.file);

    const result = await transcribeAudio(req.file.path).catch(console.error);

    if (result !== "failed") {
        return res.json(result);
    } else {
        return res.status(500).json("Transcription failed");
    }
});

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath); 

const client = new speech.SpeechClient({
    keyFilename: './private/gen-lang-client-0624281144-f9b849b4cb7a.json'
});

async function getSampleRate(inputFile) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(inputFile, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            const sampleRate = metadata.streams[0].sample_rate; // Get the sample rate from the metadata
            resolve(parseInt(sampleRate, 10)); // Return the sample rate as an integer
        });
    });
}

// Function to convert audio to mono
async function convertToMono(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputFile)
            .audioChannels(1) // Set to mono by setting all sounds into 1 channel
            .toFormat('wav') // Output format
            .on('end', () => {
                console.log('Conversion to mono completed.');
                resolve();
            })
            .on('error', (err) => {
                console.error('Error during conversion:', err);
                reject(err);
            })
            .save(outputFile);
    });
}

async function transcribeAudio(inputFileName) {
    const outputFileName = './audio/receive_mono.wav'; 

    await convertToMono(inputFileName, outputFileName);

    // Get the sample rate of the original audio file
    const sampleRateHertz = await getSampleRate(inputFileName);

    // Read the converted audio file and convert it to a Buffer
    const file = fs.readFileSync(outputFileName);
    const audioBytes = file.toString('base64');

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        content: audioBytes,
    };

    const config = {
        encoding: 'LINEAR16', 
        sampleRateHertz: sampleRateHertz, 
        languageCode: 'vi-VN', 
    };

    const request = {
        audio: audio,
        config: config,
    };

    try {
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        console.log(`Transcription: ${transcription}`);
        return transcription;
    } catch (error) {
        console.error('Error during transcription:', error);
        return "failed";
    }
}

app.post('/login', (req, res) => {
    const { username, password, age } = req.body;
    // Validate username and password here (omitted for simplicity)

    // Create a JWT with the username and age
    const token = jwt.sign({ username, age }, secretKey, { expiresIn: '1h' });

    // Set the JWT as a cookie
    res.cookie('token', token, { httpOnly: true });

    res.json({ message: 'Login successful' });
});

// JWT verification middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        req.user = decoded;
        next();
    });
};

// Protected route handler
const protectedRoute = (req, res) => {
    res.json({ message: `Hello ${req.user.username}, you have access to this route and your age is ${req.user.age}` });
};

// Apply middleware to the protected route
app.get('/protected', verifyToken, protectedRoute);

// Start the server



const PORT = process.env.PORT || 3000;

mongoose.connection.on('open', () => {
    // console.log(`Connected to MongoDB`);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});


// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
