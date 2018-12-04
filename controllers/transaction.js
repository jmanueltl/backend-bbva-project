'use strict'

var bodyParser = require('body-parser');
var requestJson = require('request-json')
const config = require('../config/config');
var urlMlabRaiz = config.mlab_host+config.mlab_db+'/collections/';
var clienteMlab;

/*function postAccountTransaction(req, res) {
postAccountTransactionTrans(req, res, req.body.accountOrigin, -1);  //abono
postAccountTransactionTrans(req, res, req.body.accountDestino, 1);  //cargo
}
*/
function postAccountTransaction(req, res) {
  var idcliente = req.params.id;
  var queryStringID = 'q={"userID":' + idcliente + '}'
  var clienteMlab =  requestJson.createClient(urlMlabRaiz + config.mlab_collection_user+ '?' + queryStringID + "&l=1&" + config.mlab_key)
  clienteMlab.get(' ',
        function(error, respuestaMLab, body){

            var jsonStr = body[0].account;
            var idAccount = req.params.idAccount;
            var accountOrigin = req.body.accountOrigin;
            var accountDestino = req.body.accountDestino;
            var jsonModificado =  new Array();
            jsonModificado = forEachAccount(jsonStr,accountOrigin,req, -1);
            jsonModificado = forEachAccount(jsonModificado,accountDestino,req, -1);
            //console.log(jsonModificado[0]);
            var newAccount = '{"$set": {"account":'+ JSON.stringify(jsonStr)+'}}';
            clienteMlab.put( urlMlabRaiz +'/user?'+ queryStringID + "&" +config.mlab_key , JSON.parse(newAccount),
              function(error, respuestaMLab, body){
                  res.send(body);
              });
        });
}


function forEachAccount(jsonStr, account,req, paramSigno){
  var newID = 0;
  jsonStr.forEach(function(item, index){
      if(item.nroAccount == account){
          req.body.monto = req.body.monto * paramSigno;
          item.saldo = parseInt(item.saldo,10) + parseInt(req.body.monto,10);
          if(item.transaction === undefined || item.transaction === []){
            newID = 1;
            item.transaction = []
          }
          else
            {newID = Math.max.apply(Math, item.transaction.map(function(o) {  return o.idTransaction; })) + 1;}
          req.body.idTransaction = newID;
          item.transaction.push(req.body);
          console.log(item.transaction);
      }
  });
  return jsonStr;
}


function deleteAccountTransaction(req, res) {
  var idcliente = req.params.id
  var queryStringID = 'q={"userID":' + idcliente + '}'
  var clienteMlab =  requestJson.createClient(urlMlabRaiz + config.mlab_collection_user+ '?' + queryStringID + "&l=1&" + config.mlab_key)
  clienteMlab.get(' ',
        function(error, respuestaMLab, body){
            var newID;
            var jsonStr = body[0].account;
            var idAccount = req.params.idAccount;
            var idTransaction = req.params.idTransaction;
            jsonStr.forEach(function(item, index){
              	if(item.idAccount == idAccount){
                    findAndRemove(item.transaction, 'idTransaction', parseInt(idTransaction,10));
                    console.log(item.transaction);
              	}
            });
            console.log(jsonStr);
            var deleteAccount = '{"$set": {"account":'+ JSON.stringify(jsonStr)+'}}';
            clienteMlab.put( urlMlabRaiz +'/user?'+ queryStringID + "&" +config.mlab_key , JSON.parse(deleteAccount),
              function(error, respuestaMLab, body){
                  res.send(body);
              });

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
  postAccountTransaction,
  deleteAccountTransaction
};
