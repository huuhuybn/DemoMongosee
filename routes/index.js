var express = require('express');
var router = express.Router();

// thay the duong dan mongo cua cac ban
var urlDB = 'mongodb+srv://admin:admin@cluster0.sv5oc.mongodb.net/tinder?retryWrites=true&w=majority';
const mongoose = require('mongoose');
mongoose.connect(urlDB, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('connected!!!!')
});

var multer = require('multer')
var path = 'uploads/'
var upload = multer({dest: path})
// username
// password
// name
// address
// number_phone

var user = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    address: String,
    number_phone: String,
    avatar: String
})

/* GET home page. */
router.get('/', function (req, res, next) {
    // ket noi toi collection ten la users
    var connectUsers = db.model('users', user);
    connectUsers.find({},
        function (error, users) {
            if (error) {
                res.render('index', {title: 'Express : Loi@@@@'})
            } else {
                res.render('index', {title: 'Express', users: users})
            }
        })
});


router.get('/getUsers', function (req, res) {
    var connectUsers = db.model('users', user);
    var baseJson = {
        errorCode: undefined,
        errorMessage: undefined,
        data: undefined
    }
    connectUsers.find({}, function (err, users) {
        if (err) {
            baseJson.errorCode = 403
            baseJson.errorMessage = '403 Forbidden'
            baseJson.data = []
        } else {
            baseJson.errorCode = 200
            baseJson.errorMessage = 'OK'
            baseJson.data = users
        }
        res.send(baseJson);
    })

})


router.post('/insertUser', upload.single('avatar'), function (req, res) {
    console.log(req.body);
    var connectUsers = db.model('users', user);
    connectUsers({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        address: req.body.address,
        number_phone: req.body.number_phone,
        avatar: path + req.file.filename + '.jpg'
    }).save(function (error) {
        if (error) {
            res.render('index', {title: 'Express Loi!!!!'});
        } else {
            res.render('index', {title: 'Express Thanh Cong'});
        }
    })
})


module.exports = router;
