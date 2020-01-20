# cfn-cur-report-definition
A custom CloudFormation resource for Cost and Usage Reports for the usage with CloudFormation stacks, as well as the Serverless framework.

## Usage

### CloudFormation

If you just want to use the custom resource, copy the [dist/cfn-cur-reportdefinition.yml](dist/cfn-cur-reportdefinition.yml) file to your CloudFormation project.

Additionally, you need to add another resource to the stack in which you configure the Cost Usage ReportDefinition:

```yaml
Resources:
  CostUsageReportDefinition:
    Type: 'Custom::CostUsageReportDefinition'
    Properties:
      AdditionalSchemaElements:
        - 'RESOURCES'
      Compression: 'Parquet'
      Format: 'Parquet'
      ReportName: 'test-report'
      ReportVersioning: 'CREATE_NEW_REPORT'
      RefreshClosedReports: True
      S3Bucket: !Ref TestBucket
      S3Prefix: 'usagereports/'
      S3Region: 'us-east-1'
      TimeUnit: 'DAILY'
      ServiceToken: !GetAtt CustomCostUsageReportDefinitionLambda.Arn
```

### Serverless

For an example configuration with the Serverless framework, you can have a look in the [example](example/) subfolder. This contains a valid [serverless.yml](example/serverless.yml) file with a configuration that can be customized.

You basically need three resources:

* A S3 bucket with an [appropriate BucketPolicy](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/billing-getting-started.html#step-2)
* The custom resource for the Cost Usage ReportDefinition (see [dist/sls-cur-reportdefinition.yml](dist/sls-cur-reportdefinition.yml))
* A resource which configures/uses the custom resource for the Cost Usage ReportDefinition

It could look like the following once you created the above named resources as files in the `resources` subfolder of your Serverless project:

```yaml
service:
    name: 'test-custom-cur-reportdefinition'

provider:
  name: aws
  runtime: nodejs10.x
  region: ${opt:region, 'us-east-1'}
  stage: ${opt:stage, 'dev'}
  
resources:
  - ${file(resources/s3-bucket.yml)}
  - ${file(resources/sls-cur-reportdefinition.yml)}
  - ${file(resources/cost-usage-reportdefinition.yml)}
```

The `resources/cur-reportdefinition.yml` could for example look like this:

```yaml
Resources:
  CostUsageReportDefinition:
    Type: 'Custom::CostUsageReportDefinition'
    Properties:
      AdditionalSchemaElements:
        - 'RESOURCES'
      Compression: 'Parquet'
      Format: 'Parquet'
      ReportName: 'test-report'
      ReportVersioning: 'CREATE_NEW_REPORT'
      RefreshClosedReports: True
      S3Bucket:
        Ref: TestBucket
      S3Prefix: 'usagereports/'
      S3Region: '${self:provider.region}'
      TimeUnit: 'DAILY'
      ServiceToken: 
        'Fn::GetAtt': [CustomCostUsageReportDefinitionLambda, Arn]
```

## Building
After cloning the repo, and running `npm i` in the project's path, you can run the build of the custom CloudFormation resources by running `npm run build`.

This will created/update the following files in the `dist` subfolder:

* `cfn-cur-reportdefinition.yml`: The basic custom CloudFormation resource for the creation of Cognito Resource Servers
* `sls-cur-reportdefinition.yml`: The same resource, but ready for the usage with the Serverless framework

