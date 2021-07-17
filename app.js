const express = require("express");
const multer = require("multer");
const cors = require('cors');
const fs = require('fs');
require('dotenv').config()

const PORT = process.env.PORT || 3001


const app = express();

app.use(express.json({ extended: true })) //без этих 2 мидлваров body.request будет возвращать пустой обьект
app.use(express.urlencoded()) //Это также служит заменой устаревшему bodyParser
app.use(cors());
app.use(express.static('images'));
app.use(express.static('../client/public'));

app.get("/db", function (request, response) {
    response.send(JSON.parse(fs.readFileSync('./uploads/db.txt', "utf8")))

})

app.post("/db", function (request, response) {
    let fileContent = JSON.parse(fs.readFileSync('./uploads/db.txt', "utf8"))
    console.log(fileContent)
    fs.writeFileSync('./uploads/db.txt', JSON.stringify(request.body.concat(fileContent)), (err) => {
        if (err) console.log(err);
    });
})

app.post("/delete", function (request, response) {
    const arrr = JSON.parse(fs.readFileSync("./uploads/db.txt", "utf8"))
    fs.writeFile('./uploads/db.txt', JSON.stringify(arrr.flat(2).filter(item => item.id !== request.body.id)), (err) => {
        if (err) console.log(err);
    })
})

app.post("/login", function (request, response) {
    let PSWD = (request.body.AdminPassword)
    console.log()
    if (PSWD === '123') { response.send(true); console.log(true) }
    else { response.send(false); console.log('Password denied, Your computer will self-destruct in 5 seconds') }
})


const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

app.use(express.static(__dirname));

app.use(multer({ storage: storageConfig }).single("filedata"));
app.post("/upload", function (req, res, next) {

    let filedata = req.file;
    if (!filedata)
        res.send("Ошибка при загрузке файла");
    else
        res.send("Файл загружен");
});
app.get("/register", function (request, response) {
    response.sendFile(__dirname + "/register.html");
});

app.get("/prod", function (request, response) {
    response.sendFile(__dirname + "/prod.html");
});
app.get("/index", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

// const arr = []
// app.post("/register", function (request, response) {
//     if (!request.body) return response.sendStatus(400);
//     console.log(request.body);
//     arr.push(request.body)
//     n
//     fs.writeFile('./uploads/db.txt', JSON.stringify(arr), (err) => {
//         if (err) console.log(err);
//     });
//     console.log(arr)
//     response.send(arr)
// });
app.listen(PORT, () => { console.log("Server started"); });