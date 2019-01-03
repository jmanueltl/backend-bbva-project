'use strict'

var URLbase = '/APIperu/v1/';
var bodyParser = require('body-parser');
var requestJson = require('request-json')
const config = require('../config/config');
var urlMlabRaiz = config.mlab_host+config.mlab_db+'/collections/';
var clienteMlab


function getUsers(req, res) {
    clienteMlab = requestJson.createClient(urlMlabRaiz + config.mlab_collection_user + '?' + config.mlab_key)
    clienteMlab.get('', function(err, resM, body) {
      if (!err) {
        res.send(body)
      }
    })
}

//get usuarios por id
function getUsersId(req, res) {
      var id = req.params.id
      var query = 'q={"userID":' + id + '}'//'&f={"_id":0}'
      clienteMlab = requestJson.createClient(urlMlabRaiz + config.mlab_collection_user+ '?' + query + "&l=1&" + config.mlab_key)
      clienteMlab.get('', function(err, resM, body) {
        if (!err) {
          if (body.length > 0)
            res.send(body[0])
          else {
            let response =  {"msg":"Usuario no existente"}
            res.status(404).send(response)
          }
        }
      })
}


function postUser(req , res){
  clienteMlab = requestJson.createClient(urlMlabRaiz + "/user?" + config.mlab_key)
  clienteMlab.get('', function(error, respuestaMLab, body){
    if(!error || (newID === NaN) ){
      var total = JSON.parse(body.length);
      var newID = Math.max.apply(Math, body.map(function(o) {  return o.userID; })) + 1;
      req.body.userID = newID;
      var newObject = JSON.stringify(req.body);
        clienteMlab.post( urlMlabRaiz +'/user?'+ config.mlab_key , JSON.parse(newObject),
            function(error, respuestaMLab, body){
              res.send(body);
            });
        }
      });
}


//put users
function updateUser(req, res){
    var id = req.params.id;
    var queryStringID = 'q={"userID":' + id + '}&';
    var clienteMlab =  requestJson.createClient(urlMlabRaiz);
    clienteMlab.get('user?'+ queryStringID + config.mlab_key,
        function(error, respuestaMLab, body){
                var cambio = '{"$set":'+ JSON.stringify(req.body)+'}';
                  clienteMlab.put( urlMlabRaiz +'/user?'+ queryStringID +  config.mlab_key , JSON.parse(cambio),
                    function(error, respuestaMLab, body){
                        res.send(body);
                    });
        });

  }

//DELETE user with id
function deleteUser(req, res){
      var id = req.params.id;
      var queryStringID = 'q={"userID":' + id + '}&';
      var httpClient = requestJson.createClient(urlMlabRaiz + "/user?" + queryStringID + config.mlab_key);
      httpClient.get('', function(error, respuestaMLab, body){
          var respuesta = body[0];
          httpClient.delete(urlMlabRaiz + "/user/" + respuesta._id.$oid +'?'+ config.mlab_key,
            function(error, respuestaMLab,body){
              res.send(body);
          });
        });
}

module.exports= {
getUsers,
getUsersId,
updateUser,
postUser,
deleteUser
}
