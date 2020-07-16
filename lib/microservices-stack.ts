import * as cdk from '@aws-cdk/core';
import cognito = require('@aws-cdk/aws-cognito');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import iam = require('@aws-cdk/aws-iam');
const { GraphQLInfrastructure } = require('./infrastructure/appsync');
const { LambdasInfrastructure } = require('./infrastructure/lambda');

export class MicroservicesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const table = new dynamodb.Table(this, 'LambdasTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 1,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const userPool = new cognito.UserPool(this, 'UserPool', {
      autoVerify: { email: true }
    });
    
    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool
    });

    // The code that defines your stack goes here
    const lambdas = new LambdasInfrastructure(this, 'LambdasInfrastructure', { table });

    const graphQL = new GraphQLInfrastructure(this, 'GraphQLInfrastructure', {
      lambdaSources: lambdas.handlers,
      userPool
    });

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId
    });
    
    new cdk.CfnOutput(this, 'UserPoolProviderUrl', {
      value: userPool.userPoolProviderUrl
    });
    
    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId
    });
  }
}
