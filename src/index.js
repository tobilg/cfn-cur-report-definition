const AWS = require('aws-sdk');

// See: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CUR.html
 
module.exports.handler = require('./handler')({
    cur: new AWS.CUR({ apiVersion: '2017-01-06' }),
});