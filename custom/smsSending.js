module.exports = function(token, msg,cb) {

    var request = require('request');

    var options = {
        url: 'https://api.telstra.com/v1/sms/messages',
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(msg)
    };

  

    request(options, cb);
}