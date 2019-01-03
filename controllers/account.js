'use strict'

var bodyParser = require('body-parser');
var requestJson = require('request-json')
const config = require('../config/config');
var urlMlabRaiz = config.mlab_host+config.mlab_db+'/collections/';
var clienteMlab;


//GET DETALLE CUENTAS DE UN USUARIO
function getUserAccounts(req, res) {
  var idcliente = req.params.id
  var query = 'q={"userID":' + idcliente + '}'
  var filter = 'f={"account.transaction":0 , "email" : 0 , "password":0}'
  clienteMlab = requestJson.createClient(urlMlabRaiz + "/user?" + query + "&" + filter + "&" + config.mlab_key)
  clienteMlab.get('', function(err, resM, body) {
    if(!err) {
      res.send(body[0])
    }
  })
}

//GET SÒLO CUENTAS DE USUARIO - LLENA COMBO : CUENTA DE CARGO Y ABONO
function getAccountDropdown(req, res) {
  var idcliente = req.params.id
  var query = 'q={"userID":' + idcliente + '}'
  var filter = 'f={"account.nroAccount":1 , "account.nameAccount" : 1 , "account.saldo":1}'
  clienteMlab = requestJson.createClient(urlMlabRaiz + "/user?" + query + "&" + filter + "&" + config.mlab_key)
  clienteMlab.get('', function(err, resM, body) {
    if(!err) {
      res.send(body[0])
    }
  })
}

//APERTURA DE CUENTAS DE UN USUARIO
function postUserAccounts(req, res){
  var idcliente = req.params.id
  var queryStringID = 'q={"userID":' + idcliente + '}'
  var clienteMlab =  requestJson.createClient(urlMlabRaiz + config.mlab_collection_user+ '?' + queryStringID + "&l=1&" + config.mlab_key)
  clienteMlab.get(' ',
        function(error, respuestaMLab, body){
          var newID;
          var jsonStr = body[0].account;
            if(jsonStr === undefined || jsonStr.length == 0){
              newID = 1;
              jsonStr = []
            }
            else{
              newID = Math.max.apply(Math, jsonStr.map(function(o) {  return o.idAccount; })) + 1;
            }

            if(!error || (newID === NaN) ){
                req.body.idAccount = newID;
                req.body.saldoInicial = Number(req.body.saldo);
                jsonStr.push(req.body);
                var newAccount = '{"$set": {"account":'+ JSON.stringify(jsonStr)+'}}';
                  clienteMlab.put( urlMlabRaiz +'/user?'+ queryStringID + "&" +config.mlab_key , JSON.parse(newAccount),
                    function(error, respuestaMLab, body){
                        res.send(body);
                    });
              }
              else
                res.send(error);
        });
}

//ELIMINACION DE CUENTAS DEL USUARIO
function deleteUserAccounts(req, res){
  var idcliente = req.params.id
  var queryStringID = 'q={"userID":' + idcliente + '}'
  var clienteMlab =  requestJson.createClient(urlMlabRaiz + config.mlab_collection_user+ '?' + queryStringID + "&l=1&" + config.mlab_key)
  clienteMlab.get(' ',
        function(error, respuestaMLab, body){
            if(!error){
                var jsonStr = body[0];
                var idAccount = req.params.idAccount;
                findAndRemove(jsonStr.account, 'idAccount', parseInt(idAccount,10));
                var putAccount = '{"$set": {"account":'+ JSON.stringify(jsonStr.account)+'}}';
                  clienteMlab.put( urlMlabRaiz +'/user?'+ queryStringID + "&" +config.mlab_key , JSON.parse(putAccount),
                    function(error, respuestaMLab, body){
                        res.send(body);
                    });
              }else
              res.send(error);
        });
}

function findAndRemove(array, property, value) {
  array.forEach(function(result, index) {
    if(result[property] === value) {
      array.splice(index, 1);
    }
  });
}

module.exports={
  getUserAccounts,
  postUserAccounts,
  deleteUserAccounts,
  getAccountDropdown
};
