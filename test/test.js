const chai = require('chai');
const { expect } = require('chai');
const sinon = require('sinon');
const AWS = require('aws-sdk');

const deps = {
    cur: sinon.stub(new AWS.CUR({ apiVersion: '2017-01-06' })),
};

//const handler = require('../src/handler')(deps);
const validEvent = require('./events/validEvent.json');
const invalidEvent = require('./events/invalidEvent.json');
const context = require('./events/context.json');

const CostUsageReportDefinition = require('../src/costUsageReportDefinition');

context.getRemainingTimeInMillis = () => {
    return 30000;
}

context.succeed = () => {
    return true;
}

context.done = () => {
    return true;
}

chai.config.includeStack = false;

describe("# Testing the custom CloudFormation resource", () => {

    // Reset test doubles for isolating individual test cases
    afterEach(sinon.reset);

    it("should create a valid configuration", (done) => {

        const curd = new CostUsageReportDefinition();
        const result = curd.getConfiguration(validEvent.ResourceProperties);
        console.log(result)
        
        done();

    });

});