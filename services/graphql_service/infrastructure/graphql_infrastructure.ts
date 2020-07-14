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
    const apiKey = new CfnApiKey(this, 'graphql-service-api-key', {
      apiId: api.apiId
    });

    const contactDS = api.addLambdaDataSource('ContactDS', 'Contact service as a datasource', props.contactService)

    contactDS.createResolver({
      typeName: 'Query',
      fieldName: 'listAllContacts',
      requestMappingTemplate: MappingTemplate.fromString(`{
        "version": "2017-02-28",
        "operation": "Invoke",
        "payload": {
          "field": "listAllContacts",
          "arguments": $utils.toJson($context.arguments)
       }
     }`),
      responseMappingTemplate: MappingTemplate.fromString(`$utils.toJson($context.result)`),
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

    const httpDS = api.addHttpDataSource('http', 'The http data source', 'https://aws.amazon.com/');

    httpDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'doPostOnAws',
      requestMappingTemplate: MappingTemplate.fromString(`{
        "version": "2018-05-29",
        "method": "POST",
        # if full path is https://api.xxxxxxxxx.com/posts then resourcePath would be /posts
        "resourcePath": "/path/123",
        "params":{
            "body": $util.toJson($ctx.args),
            "headers":{
                "Content-Type": "application/json",
                "Authorization": "$ctx.request.headers.Authorization"
            }
        }
      }`),
      responseMappingTemplate: MappingTemplate.fromString(`
        ## Raise a GraphQL field error in case of a datasource invocation error
        #if($ctx.error)
          $util.error($ctx.error.message, $ctx.error.type)
        #end
        ## if the response status code is not 200, then return an error. Else return the body **
        #if($ctx.result.statusCode == 200)
            ## If response is 200, return the body.
            $ctx.result.body
        #else
            ## If response is not 200, append the response to error block.
            $utils.appendError($ctx.result.body, "$ctx.result.statusCode")
        #end
      `),
    });

    // GraphQL API Endpoint
    new cdk.CfnOutput(this, 'Endpoint', {
      value: api.graphQlUrl
    });
    // API Key
    new cdk.CfnOutput(this, 'API_Key', {
      value: apiKey.attrApiKey
    });
  }
}