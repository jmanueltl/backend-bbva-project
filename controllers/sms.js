var https = require('https');

function postEnvioSMS(req, res) {
      var jsonObject = JSON.stringify(req.body);
      var postheaders = {
        'Content-Type' : 'application/json',
        'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
      };

      var optionspost = {
          host : 'app-smstxtlocal-jtl.herokuapp.com',
          path : '/mensajes/send/?apikey=NwlIyVYNc1s-1jEwFXFryO6vFNOqpFSvoetqSDAowG',
          method : 'POST',
          headers : postheaders
      };

      var status ;
      var message ;
      var reqPost = https.request(optionspost, function(res) {
          console.log("statusCode: ", res.statusCode);
          status = JSON.stringify(res.statusCode);
          res.on('data', function(d) {
              console.info('POST result:\n');
              process.stdout.write(d);
              console.info('\n\nPOST completed');
          });
      });

      if (jsonObject) {
          reqPost.write(jsonObject);
      }
      reqPost.end();
      res.send({"message":"send","status":"ok"});
  };

module.exports={
  postEnvioSMS
};
