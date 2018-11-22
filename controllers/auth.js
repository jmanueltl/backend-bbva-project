const requestJson = require('request-json');
const service =require('../services');
const config = require('../config/config');


var urlMlabRaiz = config.mlab_host+config.mlab_db+'/collections/';
//"https://api.mlab.com/api/1/databases/techupruebabbva/collections"

//var apiKey = "apiKey=7is_G5cOfCdtAwvu0orSgkcxVnSFGPo6"
var clienteMlab

//LOGIN
function login(req, res){
      var email = req.body.email
      var password = req.body.password
      var query = 'q={"email":"' + email + '","password":"' + password + '"}&'
      console.log(urlMlabRaiz+config.mlab_collection_user+'?'+query+config.mlab_key);
      clienteMlab = requestJson.createClient(urlMlabRaiz)//urlMlabRaiz + "/user?" + query + "&l=1&" + apiKey)
      clienteMlab.get(config.mlab_collection_user+'?'+query+config.mlab_key, function(err, resM, body) {
        if (!err) {
          if (body.length == 1) { // Login ok
            console.log(body[0]);
            var estado = '{"$set":{"logged":"true"}}'
            clienteMlab.put(config.mlab_collection_user + '?q={"userID": ' + body[0].userID + '}&' + config.mlab_key, JSON.parse(estado),
            function(errP, resP, bodyP) {
                res.status(200).send({"login":"ok", "id":body[0]._id, "nombre":body[0].first_name, "apellidos":body[0].last_name, "userID":body[0].userID, token:service.createToken(body[0].userID) })
            })
          }
          else
            res.status(404).send({"msg" : "Datos incorrectos"})
        }
        else
          res.status(500).send({"msg":"Error del servidor interno"})
      });
  }


  //logout
  function logout(req, res) {
      var id = req.body.userID
      var query = 'q={"userID":' + id + ', "logged":"true"}&'
      console.log(urlMlabRaiz + config.mlab_collection_user + '?' + query+config.mlab_key);
      clienteMlab = requestJson.createClient(urlMlabRaiz);// + config.mlab_collection_user+'?' + query + "&l=1&" + config.mlab_key)
      clienteMlab.get(config.mlab_collection_user + '?' + query+config.mlab_key, function(err, resM, body) {
        if (!err) {console.log(err);
          if (body.length == 1) // Estaba logado
          {
            clienteMlab = requestJson.createClient(urlMlabRaiz + config.mlab_collection_user)
            var cambio = '{"$unset":{"logged":"true"}}'
            clienteMlab.put('?q={"userID": ' + body[0].userID + '}&' + config.mlab_key, JSON.parse(cambio),
              function(errP, resP, bodyP) {
                res.send({"logout":"ok", "id":body[0].userID})
            })
          }
          else {
            res.status(404).send('Usuario no logeado previamente')
          }
        }
      });
  }


  module.exports={
    login,
    logout
  };
