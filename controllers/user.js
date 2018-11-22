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

module.exports= {
getUsers,
getUsersId
}

/*


//GET CUENTAS DE UN USUARIO
app.get(URLbase + 'users/:id/accounts', function(req, res) {
  var idcliente = req.params.id
  var query = 'q={"userID":' + idcliente + '}'
  var filter = 'f={"account.transaction":0 , "email" : 0 , "password":0}'
  clienteMlab = requestJson.createClient(urlMlabRaiz + "/user?" + query + "&" + filter + "&" + apiKey)
  clienteMlab.get('', function(err, resM, body) {
    if(!err) {
      res.send(body)
    }
  })
})

// GET MOVIMIENTOS DE UNA CUENTA
app.get(URLbase + 'users/:id/transaction', function(req, res) {
  var idcliente = req.params.id
  var query = 'q={"userID":' + idcliente + '}'
  var filter = 'f={"account.transaction":1 , "email" : 0 , "password":0}'
  clienteMlab = requestJson.createClient(urlMlabRaiz + "/user?" + query + "&" + filter + "&" + apiKey)
  clienteMlab.get('', function(err, resM, body) {
    if(!err) {
      res.send(body)
    }
  })
})

app.get(URLbase + 'users', function(req, res) {
    clienteMlab = requestJson.createClient(urlMlabRaiz + "/user?" + apiKey)
    clienteMlab.get('', function(err, resM, body) {
      if (!err) {
        res.send(body)
      }
    })
})

//get usuarios por id
app.get(URLbase + 'users/:id',  function(req, res) {
      var id = req.params.id
      var query = 'q={"userID":' + id + '}'//'&f={"_id":0}'
      clienteMlab = requestJson.createClient(urlMlabRaiz + "/user?" + query + "&l=1&" + apiKey)
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
})


app.post( URLbase + 'users', function (req , res){
  clienteMlab = requestJson.createClient(urlMlabRaiz + "/user?" + apiKey)
  clienteMlab.get('', function(error, respuestaMLab, body){
      var newID = Math.max.apply(Math, body.map(function(o) {  return o.userID; })) + 1;
      console.log('nuevo id : '+newID);
      req.body.userID = newID;
      var newObject = JSON.stringify(req.body);
        clienteMlab.post( urlMlabRaiz +'/user?'+ apiKey , JSON.parse(newObject),
            function(error, respuestaMLab, body){
              res.send(body);
            });
        });
  });

//probando  pdf

var path = require('path');

app.get(URLbase + 'downloadFile', function (req, res) {
   var file = path.join(__dirname, '/home/alumno/Descargas/INVITACION ENCUENTRO DE EGRESADOS 2018.pdf');
   res.download(file, function (err) {
       if (err) {
           console.log("Error");
           console.log(err);
       } else {
           console.log("Success");
       }
   });
});



//put users
app.put( URLbase + 'users/userID:id', function (req, res){
    var id = req.params.id;
    var queryStringID = 'q={"userID":' + id + '}&';
    var clienteMlab =  requestJson.createClient(urlMlabRaiz);
    clienteMlab.get('user?'+ queryStringID + apiKey,
        function(error, respuestaMLab, body){
                var cambio = '{"$set":'+ JSON.stringify(req.body)+'}';
                  clienteMlab.put( urlMlabRaiz +'/user?'+ queryStringID +  apiKey , JSON.parse(cambio),
                    function(error, respuestaMLab, body){
                      //console.log(respuestaMLab);
                        console.log("body:"+body);
                        res.send({"msg":"Usuario actualizado correctamente",body});
                    });
        });

  });

//DELETE user with id
app.delete(URLbase + "users/userID:id",
  function(req, res){
    var id = req.params.id;
    var queryStringID = 'q={"userID":' + id + '}&';
    var httpClient = requestJson.createClient(urlMlabRaiz + "/user?" + queryStringID + apiKey);
    httpClient.get('', function(error, respuestaMLab, body){
        var respuesta = body[0];
        httpClient.delete(urlMlabRaiz + "/user/" + respuesta._id.$oid +'?'+ apiKey,
          function(error, respuestaMLab,body){
            res.send(body);
        });
      });
  });






//CUENTAS
app.get(URLbase + 'accounts/:id', function(req, res) {
  var idcliente = req.headers.id
  var query = 'q={"idcliente":' + idcliente + '}'
  var filter = 'f={"iban":1,"_id":0}'
  clienteMlab = requestJson.createClient(urlMlabRaiz + "/account?" + query + "&" + filter + "&" + apiKey)
  clienteMlab.get('', function(err, resM, body) {
    if(!err) {
      res.send(body)
    }
  })
})

//LOGIN
function login(req, res){
      var email = req.body.email
      console.log('aqui');
      var password = req.body.password
      var query = 'q={"email":"' + email + '","password":"' + password + '"}'
      clienteMlab = requestJson.createClient(urlMlabRaiz + "/user?" + query + "&l=1&" + apiKey)
      clienteMlab.get('', function(err, resM, body) {
        if (!err) {
          if (body.length == 1) { // Login ok
            console.log(body[0]);
            var estado = '{"$set":{"logged":"true"}}'
            clienteMlab.put(urlMlabRaiz + '/user?q={"userID": ' + body[0].userID + '}&' + apiKey, JSON.parse(estado),
            function(errP, resP, bodyP) {
                res.send({"login":"ok", "id":body[0]._id, "nombre":body[0].first_name, "apellidos":body[0].last_name, "userID":body[0].userID, token:service.createToken(body[0].userID) })
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

      var query = 'q={"userID":' + id + ', "logged":"true"}'
      clienteMlab = requestJson.createClient(urlMlabRaiz + "/user?" + query + "&l=1&" + apiKey)
      clienteMlab.get('', function(err, resM, body) {
        if (!err) {
          if (body.length == 1) // Estaba logado
          {
            clienteMlab = requestJson.createClient(urlMlabRaiz + "/user")
            var cambio = '{"$unset":{"logged":"true"}}'
            clienteMlab.put('?q={"userID": ' + body[0].userID + '}&' + apiKey, JSON.parse(cambio),
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
*/
