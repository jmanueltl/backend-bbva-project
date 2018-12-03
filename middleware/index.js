'use strict'

const services=require('../services');

function isAuth(req, res,next){
    //console.log(req.headers.authorization);
    if(!req.headers.authorization)
      return res.status(403).send({message:'No tienes autorizacion'});
      console.log('token recibido :'+ req.headers.authorization)
      const token   = req.headers.authorization.split(" ")[0];// 0 para POSTMAN
      services.decodeToken(token)
        .then(response=>{
          req.user=response;
          next();
        })
        .catch(response=>{
          res.status(response.status).send(response.message);
        })
    }

module.exports={
isAuth
};
