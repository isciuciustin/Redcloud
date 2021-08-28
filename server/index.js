const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    service: 'gmail',
    auth: {
        user: 'isccompany0@gmail.com',
        pass: '0REGH%>pa'
    }
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../my-app/public/images")
    },
    filename: function (req, file, cb) {
        cb(null, "IMG" + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage });


const saltRounds = 10;
let nowuser = "guest";

//MySQL
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "db"
});

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieparser());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

//SESSION
app.use(
    session({
        key: "userId",
        secret: "subscribe",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
);

app.post("/api/login", (req, res) => {
    const user = req.body.user;
    const paswd = req.body.paswd;
    const sql = "SELECT * FROM users WHERE user = ?";
    con.query(sql, user, (err, result) => {
        if (err) {
            throw err;
        }
        bcrypt.compare(paswd, result[0].text, (error, response) => {
            req.session.user = result;
            res.send(result);
        })
    })
});

app.get("/api/login", (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user })
        nowuser = req.session.user;
        console.log(nowuser);
    }
    else {
        res.send({ loggedIn: false })
    }
})

app.get("/api/get", (req, res) => {
    const sql = "SELECT * FROM users";
    con.query(sql, (err, result) => {
        res.send(result)
    });

})

const randcode = () => {
    const len = 8;
    let str = '';
    for (let i = 0; i < len; i++) {
        let ch = Math.floor((Math.random() * 10) + 1);
        str += ch;
    }
    return str;
}

app.post("/api/register", (req, res) => {
    const user = req.body.user;
    const email = req.body.email;
    const paswd = req.body.paswd;
    const paswd2 = req.body.paswd2;
    const sqlcheck = "SELECT * FROM users where user = ?";
    if (user.length == 0 || email.length == 0 || paswd.length == 0 || paswd2 == 0) {
        res.send('Fields uncopleted');
    }
    else {
        con.query(sqlcheck, [user], (err, result) => {
            console.log(result)
            if (result.length > 0) {
                res.send('Username already exists!')
            }
            else {

                if (paswd.length < 8) {
                    res.send('Password needs to be at least 8 characters');
                }
                else
                    if (paswd2 != paswd) {
                        res.send('Passwords do not match')
                    }
                    else {

                        const isverified = false;
                        const size = 0.555;
                        let code = randcode();
                        var mailOptions = {
                            from: 'isccompany0@gmail.com',
                            to: email,
                            subject: 'Sending Email using Node.js',
                            text: 'That was easy!',
                            html: `<p><h1>${code}</h1></p>`
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        code += '-' + Date.now().toString();

                        const sql = "INSERT INTO  users (user, email, paswd, size, randcode, isverified) VALUES  (?, ?, ?, ?, ?, ?)";
                        bcrypt.hash(paswd, saltRounds, (err, hash) => {
                            if (err)
                                console.log(err);
                            con.query(sql, [user, email, hash, size, code, isverified], (err, res) => {
                                console.log("Yas a new user");
                            });
                        })
                        res.send('');
                    }
            }
        })
    }

});

app.post("/api/verify", (req, res) => {
    const user = req.body.user;
    const code = req.body.code;
    const sqlselect = "SELECT randcode from users where user = ?";
    con.query(sqlselect, [user], (err, result) => {
        var randcode = result[0].randcode.split('-');
        var codeindb = randcode[0];
        var dateindb = randcode[1];
        if (Date.now() - dateindb <= 600000) {
            if (code == codeindb) {
                const isverified = true;
                const sql = "UPDATE users SET isverified = ? where user = ?";
                con.query(sql, [isverified, user], (err, res) => {
                    console.log("New verified email");
                });
                res.send('')
            }
            else {
                res.send('Incorrect code');
            }
        }
        else {
            res.send('Code expired');
        }
    });
})

app.post("/:user", upload.array('file', 10), (req, res) => {
    let user = req.params.user.toString();
    user = user.substr(1, user.length - 1);
    user = user.substr(0, user.length - 1);
    for (let i = 0; i < req.files.length; i++) {
        const ext = req.files[i].filename.split('.')[1];
        const sql = "INSERT INTO img (users, namefile, size, ext) VALUES(?,?,?, ?)";
        con.query(sql, [user, req.files[i].filename, req.files[i].size, ext], (err, res) => {
            console.log("Yas, new image!");
        });
    }
});
app.get("/api/data/:user", (req, res) => {
    let user = req.params.user.toString();
    user = user.substr(1, user.length - 1);
    user = user.substr(0, user.length - 1);
    const sql = "SELECT * FROM users where user = ?";

    con.query(sql, [user], (err, result) => {
        res.send(result)
    });

})
app.post("/api/buy", (req, res) => {
    let type = req.body.type;
    let user = req.body.user.toString();
    let size = (type == 3 ? 250 : 100);
    const sql = "UPDATE users SET size = size + ? where user = ?";

    con.query(sql, [size, user], (err, result) => {
        res.send(result)
    });
})
app.get("/api/img/:user", (req, res) => {
    let user = req.params.user.toString();
    user = user.substr(1, user.length - 1);
    user = user.substr(0, user.length - 1);
    const sql = "SELECT * FROM img where users = ?";

    con.query(sql, [user], (err, result) => {
        res.send(result)
    });

})

app.post("/remove/:path", (req, res) => {
    let name = req.params.path.toString();
    name = name.substr(1, name.length - 1);
    name = name.substr(0, name.length - 1);
    let path = "../my-app/public/images/" + name;
    fs.unlinkSync(path)
    console.log(path)
    const sql = "delete from img where namefile = ?"
    con.query(sql, [name], (err, result) => {
        res.send(result)
    });
})

app.listen(process.env.PORT || 3001, () => {
    console.log("AIR ON http://localhost:3001");
});


