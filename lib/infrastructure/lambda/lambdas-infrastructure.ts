import { join } from 'path';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
const listOfLambdaFunctions = require('./lambdas-list');

interface Handlers {
  [lambdaName: string]: lambda.IFunction
}

export class LambdasInfrastructure extends cdk.Construct {
  public readonly handlers: Handlers = {};

  constructor(scope: cdk.Construct, id: string, props: any) {
    super(scope, id);
   

    for(const lambdaName in listOfLambdaFunctions) {
      const { pathFromRoot, handler } = listOfLambdaFunctions[lambdaName]
      this.handlers[lambdaName] = new lambda.Function(this, `${lambdaName}Handler`, {
          runtime: lambda.Runtime.NODEJS_12_X,
          handler: handler || `${lambdaName}.handler`,
          code: lambda.Code.fromAsset(join(__dirname, '../../../', pathFromRoot)),
          environment: {
              TABLE_ENTITY: props.table.tableName
          }
      });
      // grant the lambda role read/write permissions to our table
      props.table.grantReadWriteData(this.handlers[lambdaName]);
    }

  }
}