const express = require('express');
const router = express.Router();
const BigCommerce = require('node-bigcommerce');
const axios = require("axios");


const bigCommerce = new BigCommerce({
  clientId: 'l51u1b4vhka1kboorz2n49507h2l1pl',
  secret: 'dcba427db2f9d26b8f8e8af763f4a1827b6500ce24703cdf204d115c941fca0f',
  callback: 'https://b7e24b79e91f.ngrok.io/auth',
  responseType: 'json'
});

router.get('/', (req, res, next) => {
  bigCommerce.authorize(req.query).then((data) => {
    //console.log("auth log", data)
    let accessToken = data.access_token;
    let storeHash = data.context;
    const headerData = {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Auth-Token": accessToken
      }
    }
    axios.get(
      "https://api.bigcommerce.com/" + storeHash + "/v2/store",
      headerData
    ).then((resp) => {
      //console.log(resp.data);

      res.render('auth', {
        title: 'Authorization successfull!',
        accessToken: accessToken,
        storeHash: storeHash,
        url: resp.data.domain

      });
    }, (err) => {

      res.render('error', {
        message: 'Something went wrong!'
      });
    });

  }, (err) => {
    res.render('error', {
      message: 'Authorization failed'
    });
  })
});
module.exports = router;