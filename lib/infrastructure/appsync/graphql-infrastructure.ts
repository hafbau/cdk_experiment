import { join } from 'path';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { IUserPool } from '@aws-cdk/aws-cognito';
import { CfnApiKey, GraphQLApi, MappingTemplate, FieldLogLevel, AuthorizationType, UserPoolDefaultAction } from '@aws-cdk/aws-appsync';

const listOfLambdaFunctions = require('../lambda/lambdas-list');


interface Handlers {
  [lambdaName: string]: lambda.IFunction
}

interface GraphQLInfrastructureProps {
  // contactService: lambda.IFunction;
  lambdaSources: Handlers;
  userPool: IUserPool;
}

export class GraphQLInfrastructure extends cdk.Construct {
  public readonly handler: lambda.Function;
  constructor(scope: cdk.Construct, id: string, props: GraphQLInfrastructureProps) {
    super(scope, id);

    const api = new GraphQLApi(this, 'Api', {
      name: `demoapi`,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            defaultAction: UserPoolDefaultAction.ALLOW,
            userPool: props.userPool
          }
        }
      },
      schemaDefinitionFile: join(__dirname, '../../../services/graphql_service/schema.graphql'),
    });

    
    for(const lambdaName in props.lambdaSources) {
      const ds = api.addLambdaDataSource(`${lambdaName}DS`, lambdaName, props.lambdaSources[lambdaName]);

      listOfLambdaFunctions[lambdaName].resolvers.forEach((resolverConfig: any) => {
        ds.createResolver({
          ...resolverConfig,
          requestMappingTemplate: MappingTemplate.fromString(`
          #**
            The value of 'payload' after the template has been evaluated
            will be passed as the event to AWS Lambda.
          *#
          {
            "version": "2017-02-28",
            "operation": "Invoke",
            "payload": {
              "args": $util.toJson($context.arguments),
              "identity": $util.toJson($context.identity)
           }
         }`),
          responseMappingTemplate: MappingTemplate.fromString(`
          #if($context.error)
            $util.error($context.error.message, $context.error.type, $context.result)
          #end
          $util.toJson($context.result)
          `),
        })
      })

    }

    // GraphQL API Endpoint
    new cdk.CfnOutput(this, 'Endpoint', {
      value: api.graphQlUrl
    });
  }
}