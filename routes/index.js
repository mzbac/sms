var express = require('express');
var router = express.Router();
var msgSender = require("../custom/smsSending")
var msgResponse = require("../custom/checkReply")
var request = require('request');
var token;
/* GET home page. */
router.get('/', function(req, res, next) {


    res.render('index', {
        title: 'telstra SMS API Demo'
    });


});
router.post('/', function(req, res, next) {
    if (!token || token.expire < new Date()) {
        request('https://api.telstra.com/v1/oauth/token?client_id=grM91VLAenCuka8qIADerlSGDThG9Tjn&client_secret=RYP8aDQWVPhCCVR4&grant_type=client_credentials&scope=SMS', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                token = JSON.parse(body);
                token.expire = new Date();
                token.expire.setHours(token.expire.getHours() + 1);
                sendMessage(req, res)
            }
        })
    }
    else {
        sendMessage(req, res)
    }
});
router.post('/response', function(req, res, next) {
    if (!req.body.msgId) {

        res.render('index', {
            title: 'telstra SMS API Demo'
        });
    }
    if (!token || token.expire < new Date()) {
        request('https://api.telstra.com/v1/oauth/token?client_id=grM91VLAenCuka8qIADerlSGDThG9Tjn&client_secret=RYP8aDQWVPhCCVR4&grant_type=client_credentials&scope=SMS', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                token = JSON.parse(body);
                token.expire = new Date();
                token.expire.setHours(token.expire.getHours() + 1);
                checkReply(req, res, req.body.msgId)
            }
        })
    }
    else {
        checkReply(req, res, req.body.msgId)
    }
});

function sendMessage(req, res) {
    var msg = {};
    msg.to = req.body.number;
    msg.body = req.body.msg;
    msgSender(token.access_token, msg, function(error, response, body) {
        if (!error && (response.statusCode == 200 || response.statusCode == 202)) {

            res.render('index', {
                title: 'telstra SMS API Demo',
                message: {
                    id: JSON.parse(body).messageId
                }
            });
        }
    });

}

function checkReply(req, res, messageId) {
    msgResponse(token.access_token, messageId, function(error, response, body) {
        if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
            var result=JSON.parse(body);
            if (!result.length>0) {
                res.render('reply', {
                   
                });
            }else{
                 res.render('reply', {
                    message: result
                });
            }
        }
    });
}
module.exports = router;
