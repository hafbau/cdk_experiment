import { join } from 'path';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { IUserPool } from '@aws-cdk/aws-cognito';
import { CfnApiKey, GraphQLApi, MappingTemplate, FieldLogLevel, AuthorizationType, UserPoolDefaultAction } from '@aws-cdk/aws-appsync';


interface GraphQLInfrastructureProps {
  contactService: lambda.IFunction;
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
      schemaDefinitionFile: join(__dirname, '../src/schema.graphql'),
    });

    const contactDS = api.addLambdaDataSource('ContactDS', 'Contact service as a datasource', props.contactService)

    contactDS.createResolver({
      typeName: 'Query',
      fieldName: 'listAllContacts',
      requestMappingTemplate: MappingTemplate.fromString(`
      #**
        The value of 'payload' after the template has been evaluated
        will be passed as the event to AWS Lambda.
      *#
      {
        "version": "2017-02-28",
        "operation": "Invoke",
        "payload": {
          "field": "listAllContacts",
          "arguments": $util.toJson($context.arguments),
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

    const noneDS = api.addNoneDataSource('None', 'Static data source');

    noneDS.createResolver({
      typeName: 'Query',
      fieldName: 'getServiceVersion',
      requestMappingTemplate: MappingTemplate.fromString(JSON.stringify({
        version: '2017-02-28',
      })),
      responseMappingTemplate: MappingTemplate.fromString(JSON.stringify({
        version: 'v1',
      })),
    });

    // GraphQL API Endpoint
    new cdk.CfnOutput(this, 'Endpoint', {
      value: api.graphQlUrl
    });
  }
}