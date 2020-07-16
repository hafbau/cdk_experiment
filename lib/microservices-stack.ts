import * as cdk from '@aws-cdk/core';
import cognito = require('@aws-cdk/aws-cognito');
import dynamo = require('@aws-cdk/aws-dynamodb');
import iam = require('@aws-cdk/aws-iam');
import { GraphQLInfrastructure } from '../services/graphql_service/infrastructure';
const { LambdasInfrastructure } = require('./infrastructure/lambda');

export class MicroservicesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'UserPool', {
      autoVerify: { email: true }
    });
    
    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool
    });

    // The code that defines your stack goes here
    const lambdas = new LambdasInfrastructure(this, 'LambdasInfrastructure', {});

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
