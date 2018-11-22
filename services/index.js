'use strict'

const jwt=require('jwt-simple');
const moment=require('moment');
const config=require('../config/config');

  function createToken(id){
    const payload={
      sub: id,
      iat: moment().unix(),
      iat: moment().add(14,'days').unix(),
    };
    return jwt.encode(payload,config.SECRET_TOKEN);
  }

  function decodeToken(token){
    console.log('token:'+token);
      const decode=new Promise((resolve,reject)=>{
      try{
        const payload= jwt.decode(token,config.SECRET_TOKEN);
        if(payload.exp < moment().unix){
        reject({
          status:401,
          message: 'Token ha Expirado'
        })
        }
        resolve(payload.sub);
      }catch (err){
        reject({
          status:500,
          message: 'Invalid token'
        })
      }
  });
  return decode;
  }


module.exports={
  createToken,
  decodeToken
};
