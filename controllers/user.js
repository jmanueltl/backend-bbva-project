var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var URLbase = '/APIperu/v1/';
var bodyParser = require('body-parser');
var requestJson = require('request-json')


app.use(bodyParser.json());

var urlMlabRaiz = "https://api.mlab.com/api/1/databases/techupruebabbva/collections"
var apiKey = "apiKey=7is_G5cOfCdtAwvu0orSgkcxVnSFGPo6"
//antes  apiKey=fV5AFYohr91lw189YRMmOM513wT5HJKN

var clienteMlab

app.get(URLbase + 'users', function(req, res) {
    clienteMlab = requestJson.createClient(urlMlabRaiz + "/user?" + apiKey)
    clienteMlab.get('', function(err, resM, body) {
      if (!err) {
        res.send(body)
      }
    })
})

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


//put users
app.put( URLbase + 'users/:id', function (req, res){
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
app.delete(URLbase + "users/:id",
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


//LOGIN
  app.post(URLbase + 'login', function(req, res) {
      var email = req.body.email
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
                res.send({"login":"ok", "id":body[0]._id, "nombre":body[0].first_name, "apellidos":body[0].last_name})
            })
          }
          else
            res.status(404).send({"msg" : "Datos incorrectos"})
        }
        else
          res.status(500).send({"msg":"Error del servidor interno"})
      })
  })

//logout
app.post(URLbase + 'logout', function(req, res) {
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
          res.status(200).send('Usuario no logeado previamente')
        }
      }
    })
})


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


module.exports=app;
