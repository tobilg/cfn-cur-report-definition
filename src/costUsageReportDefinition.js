
class CostUsageReportDefinition {
    constructor () {
        this.ap = {
            AdditionalArtifacts: {
              r: false,
              vv: ['REDSHIFT', 'QUICKSIGHT', 'ATHENA']
            },
            AdditionalSchemaElements: {
              r: true,
              vv: ['RESOURCES']
            },
            Compression: {
              r: true,
              vv: ['ZIP', 'GZIP', 'Parquet']
            },
            Format: {
              r: true,
              vv: ['textORcsv', 'Parquet']
            },
            RefreshClosedReports: {
              r: false
            },
            ReportName: {
              r: true
            },
            ReportVersioning: {
              r: false,
              vv: ['CREATE_NEW_REPORT', 'OVERWRITE_REPORT']
            },
            S3Bucket: {
              r: true
            },
            S3Prefix: {
              r: true
            },
            S3Region: {
              r: true
            },
            TimeUnit: {
              r: true,
              vv: ['HOURLY', 'DAILY']
            }
          }
    }

    getRequiredProps () {
        return Object.getOwnPropertyNames(this.ap).filter(prop => this.ap[prop].r);
    }

    arrayContainsArray (superset, subset) {
        if (0 === subset.length) {
          return false;
        }
        return subset.every(function (value) {
          return (superset.indexOf(value) >= 0);
        });
    }

    getConfiguration (resourceProperties) {
        // Get required properties
        const requiredProperties = this.getRequiredProps();
        // Make shallow copy & clean unnecessary property
        let cleanedProperties = Object.assign({}, resourceProperties);
        delete cleanedProperties.ServiceToken;
        // Parameter placeholder for the AWS SDK call
        const params = { ReportDefinition: {} };
        // Check if required properties are there
        if (!this.arrayContainsArray(Object.getOwnPropertyNames(cleanedProperties), requiredProperties)) {
          return { error: 'Not all required properties specified (' + requiredProperties.join(', ') + ')' }
        } else if (cleanedProperties.ReportName.match(/[0-9A-Za-z!\-_.*\'()]+/g).length !== 1) {
          return { error: `Invalid 'ReportName' property: '${cleanedProperties.ReportName}'` }
        } else { 
          // S3Bucket needs a string
          if (Array.isArray(cleanedProperties.S3Bucket)) {
            cleanedProperties.S3Bucket = cleanedProperties.S3Bucket[0];
          }
          // Check if values are fine
          Object.getOwnPropertyNames(cleanedProperties).forEach(property => {
            // Check if array is necessary
              if (this.ap[property].hasOwnProperty('vv') && !Array.isArray(this.ap[property]['vv']) && !this.ap[property]['vv'].includes(cleanedProperties[property])) {
                  console.log("uhsdufdi")
                  return { error: 'Invalid configuration specified for \'' + property + '\' (\'' + cleanedProperties[property] + '\' instead of one of \'' + this.ap[property]['vv'].join(', ') + '\')' }
              } else if (this.ap[property].hasOwnProperty('vv') && Array.isArray(this.ap[property]['vv']) && Array.isArray(cleanedProperties[property])) {
                  cleanedProperties[property].forEach(value => {
                      if (!this.ap[property]['vv'].includes(value)) {
                          return { error: 'Invalid configuration specified for \'' + property + '\' (\'' + value + '\' instead of one of \'' + this.ap[property]['vv'].join(', ') + '\')' }
                      }
                  });
                  params.ReportDefinition[property] = cleanedProperties[property];
              } else {
                  if (property === 'RefreshClosedReports') {
                      params.ReportDefinition[property] = Boolean(cleanedProperties[property]);
                  } else {
                      params.ReportDefinition[property] = cleanedProperties[property];
                  }
              }
          });
          return params;
        }
    }
}

module.exports = CostUsageReportDefinition;
