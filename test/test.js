const chai = require('chai');
const { expect } = require('chai');
const sinon = require('sinon');
const AWS = require('aws-sdk');

const deps = {
    cur: sinon.stub(new AWS.CUR({ apiVersion: '2017-01-06' })),
};

//const handler = require('../src/handler')(deps);
const validEvent = require('./events/validEvent.json');
const s3BucketArrayEvent = require('./events/s3BucketArrayEvent.json');
const invalidEvent = require('./events/invalidEvent.json');
const invalidReportNameEvent = require('./events/invalidReportNameEvent.json');
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
        
        expect(result.hasOwnProperty('error')).to.not.equal(true)
        done();

    });

    it("should not create an invalid configuration with missing report name", (done) => {

      const curd = new CostUsageReportDefinition();
      const result = curd.getConfiguration(invalidEvent.ResourceProperties);
      
      expect(result.hasOwnProperty('error')).to.equal(true)
      done();

    });

    it("should not create an invalid configuration with invalid report name", (done) => {

      const curd = new CostUsageReportDefinition();
      const result = curd.getConfiguration(invalidReportNameEvent.ResourceProperties);
      
      expect(result.hasOwnProperty('error')).to.equal(true)
      done();

    });

    it("should create a valid configuration if array is passed for S3Bucket", (done) => {

      const curd = new CostUsageReportDefinition();
      const arrayResult = curd.getConfiguration(s3BucketArrayEvent.ResourceProperties);

      let cleanedProperties = Object.assign({}, validEvent.ResourceProperties);
      delete cleanedProperties.ServiceToken;
      
      expect(arrayResult.ReportDefinition).to.deep.equal(cleanedProperties);
      done();

  });

});