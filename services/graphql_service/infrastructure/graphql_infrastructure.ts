import { join } from 'path';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { CfnApiKey, PrimaryKey, Values, GraphQLApi, MappingTemplate, FieldLogLevel, AuthorizationType } from '@aws-cdk/aws-appsync';
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb';

export class GraphQLInfrastructure extends cdk.Construct {
  public readonly handler: lambda.Function;
  constructor(scope: cdk.Construct, id: string, props: any) {
    super(scope, id);


    const api = new GraphQLApi(this, 'Api', {
      name: `demoapi`,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
        }
      },
      schemaDefinitionFile: join(__dirname, '../src/schema.graphql'),
    });
    const apiKey = new CfnApiKey(this, 'graphql-service-api-key', {
      apiId: api.apiId
    });

    const noneDS = api.addNoneDataSource('None', 'Dummy data source');

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

    const customerTable = new Table(this, 'CustomerTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
    });
    const customerDS = api.addDynamoDbDataSource('Customer', 'The customer data source', customerTable);
    customerDS.createResolver({
      typeName: 'Query',
      fieldName: 'getCustomers',
      requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
    });
    customerDS.createResolver({
      typeName: 'Query',
      fieldName: 'getCustomer',
      requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id'),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
    customerDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'addCustomer',
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
          PrimaryKey.partition('id').auto(),
          Values.projecting('customer')),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
    customerDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'saveCustomer',
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
          PrimaryKey.partition('id').is('id'),
          Values.projecting('customer')),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
    customerDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'saveCustomerWithFirstOrder',
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
          PrimaryKey
              .partition('order').auto()
              .sort('customer').is('customer.id'),
          Values
              .projecting('order')
              .attribute('referral').is('referral')),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
    customerDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'removeCustomer',
      requestMappingTemplate: MappingTemplate.dynamoDbDeleteItem('id', 'id'),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
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