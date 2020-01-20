const https = require('https');
const url = require('url');

const CostUsageReportDefinition = require('./costUsageReportDefinition');
const curd = new CostUsageReportDefinition();

function handleRequest (deps, event, context, method) {
  let params;
  const paramsResult = curd.getConfiguration(event.ResourceProperties) ;
  if (method === 'deleteReportDefinition') {
    params = { ReportName: paramsResult.ReportDefinition.ReportName };
  } else if (method === 'modifyReportDefinition') { 
    params = { ReportName: paramsResult.ReportDefinition.ReportName, ...paramsResult };
  } else {
    params = paramsResult;
  };
  console.log(params);
  
  if (paramsResult.hasOwnProperty('error')) {
    sendResponse(event, context, 'FAILED', { messsage: paramsResult.error });
  } else {
    // Trigger request
    deps.cur[method](params).promise()
      .then(result => {
        sendResponse(event, context, 'SUCCESS', { message: 'OK' });
      })
      .catch(err => {
        sendResponse(event, context, 'FAILED', err);
      });
  }
}

module.exports = deps => (event, context, callback) => {
  try {
    // Install watchdog timer as the first thing
    setupWatchdogTimer(event, context, callback);

    if (event.RequestType === 'Create') {
      handleRequest(deps, event, context, 'putReportDefinition');
    } else if (event.RequestType === 'Update') {
      handleRequest(deps, event, context, 'modifyReportDefinition');
    } else if (event.RequestType === 'Delete') {
      handleRequest(deps, event, context, 'deleteReportDefinition');
    }
  } catch (err) {
    console.log(err);
    sendResponse(event, context, 'FAILED', err);
  }
}

function setupWatchdogTimer (event, context, callback) {
  const timeoutHandler = () => {
    new Promise(() => sendResponse(event, context, 'FAILED', { message: 'Timeout failure' }))
      .then(() => callback(new Error('Function timed out')))
  }
  // Set timer so it triggers one second before this function would timeout
  setTimeout(timeoutHandler, context.getRemainingTimeInMillis() - 1000);
}

// Send response to the pre-signed S3 URL
function sendResponse (event, context, responseStatus, responseData) {
  const responseBody = JSON.stringify({
    Status: responseStatus,
    Reason: responseData.message || responseData.code || '-',
    PhysicalResourceId: event.LogicalResourceId,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Data: responseData
  });

  const parsedUrl = url.parse(event.ResponseURL);
  const options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.path,
    method: 'PUT',
    headers: {
      'content-type': '',
      'content-length': responseBody.length
    }
  };

  const request = https.request(options, function (response) {
    // Tell AWS Lambda that the function execution is done
    context.done();
  });

  request.on('error', function (error) {
    // Tell AWS Lambda that the function execution is done
    context.done();
  });

  // write data to request body
  request.write(responseBody);
  request.end();
}