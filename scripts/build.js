const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const cloudFormationTemplate = readFileSync(join(__dirname, '../src', 'cloudformation.template.yml'), { encoding: 'utf8' });
const serverlessTemplate = readFileSync(join(__dirname, '../src', 'serverless.template.yml'), { encoding: 'utf8' });
const srcCode = readFileSync(join(__dirname, '../dist', 'main.js'), { encoding: 'utf8' });

console.log('Building...')

const populateCloudFormationTemplate = cloudFormationTemplate.replace('$SOURCE', srcCode);
console.log(' * Populated CloudFormation template');

writeFileSync(join(__dirname, '../dist', 'cfn-cur-reportdefinition.yml'), populateCloudFormationTemplate, { encoding: 'utf8' });
console.log(' * Wrote custom CloudFormation resource template.');

const populateServerlessTemplate = serverlessTemplate.replace('$SOURCE', srcCode);
console.log(' * Populated Serverless-compatible template');

writeFileSync(join(__dirname, '../dist', 'sls-cur-reportdefinition.yml'), populateServerlessTemplate, { encoding: 'utf8' });
console.log(' * Wrote custom Serverless-compatible resource template.');

console.log('...Finished!');
