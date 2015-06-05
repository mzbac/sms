module.exports = function(token, msgid,cb) {

    var request = require('request');

    var options = {
        url: "https://api.telstra.com/v1/sms/messages/"+msgid+"/response",
        method: 'GET',
        headers: {
           
            "Authorization": "Bearer " + token
        }
        
    };

  console.log(options.url);

    request(options, cb);
}