const express = require('express');
const router = express.Router();
const axios = require("axios");
const http = require("https");

router.post('/', function (req, res) {
    const body = req.body;

    let email = body.email;
    let accessToken = body.accessToken;
    let storeHash = body.storeHash;
    let url = body.url;

    const apiData = {
        username: email //"aditya@ntooitive.com"
    };

    const apiHeaderData = {
        headers: {
            "Content-Type": "application/json",
            apiKey: "jdAuLBMQ4R5IF6KHGtWku3FXjvjEhgZM",
            "accept-Language": "en"
        }
    };

    axios.post(
        "https://api.truabilities.com/truabilities/api/v1/services/plugin/auth",
        apiData,
        apiHeaderData
    ).then((resp) => {
        const storeToken = resp.data.data[0].token;
        const apiKeyData = {
            username: email, // "aditya@ntooitive.com",
            url: url //"spauniversaire.staging.wpengine.com"
        };

        const apiKeyHeaderData = {
            headers: {
                "Content-Type": "application/json",
                apiKey: "jdAuLBMQ4R5IF6KHGtWku3FXjvjEhgZM",
                token: storeToken
            }
        };

        axios.post(
            "https://api.truabilities.com/truabilities/api/v1/services/plugin/license",
            apiKeyData,
            apiKeyHeaderData
        ).then((keyResp) => {
            //console.log(keyResp);
            var widgetKey = keyResp.data.data[0].license_key;
            const scriptVariable = `<script async src="https://app.truabilities.com/release/truabilities.js?widgetkey=${widgetKey}" crossorigin="anonymous"></script>`;
            console.log(scriptVariable);

            var options = {
                "method": "POST",
                "hostname": "api.bigcommerce.com",
                "port": null,
                "path": "/" + storeHash + "/v3/content/scripts",
                "headers": {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "x-auth-token": accessToken
                }
            };

            var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    //console.log(body.toString());
                });
            });

            req.write(JSON.stringify({
                name: 'TruAbilities',
                description: 'Accessibilty solutions',
                html: scriptVariable,
                auto_uninstall: true,
                load_method: 'default',
                location: 'footer',
                visibility: 'all_pages',
                kind: 'script_tag',
                consent_category: 'essential'
            }));
            req.end();
            res.render('welcome', {
                title: 'Welcome to TruAbilities Compliance Connector',
                success: 'TruAbilities app has been installed successfully!'
            });

        },(err) => {
            
            res.render('error', {
                message: 'We have not found any license key against this email!'
              });
        });

        // End of Widget key fetching API 
    },(err) => {
          res.render('auth', {
            title: 'Authorization successfull!',
            accessToken: accessToken,
            storeHash: storeHash,
            url: url,
            error: 'User with this email does not exist in TruAbilities!'
    
          });  
    });





});



module.exports = router;