const express = require('express');
const router = express.Router();
const BigCommerce = require('node-bigcommerce');
const bigCommerce = new BigCommerce({
    secret: 'dcba427db2f9d26b8f8e8af763f4a1827b6500ce24703cdf204d115c941fca0f',
    responseType: 'json'
});

router.get('/', (req, next) => {
    try {
        const data = bigCommerce.verify(req.query['signed_payload']);        
    } catch (err) {
        next(err);
    }
});
module.exports = router;