const DynamoDB = require('aws-sdk/clients/dynamodb');
const { Table, Entity } = require('dynamodb-toolbox');
const {
  orgs,
} = require('./schemas')

const isLocal = process.env.IS_OFFLINE; // automatically set by Dynamolocal sls plugin

const isLocalSettings = {
  region: 'localhost',
  endpoint: 'http://localhost:8000'
};

const dbClient = isLocal
  ? new DynamoDB.DocumentClient(isLocalSettings)
  : new DynamoDB.DocumentClient();

  const tableConfig = new Table({
    name: process.env.TABLE_ENTITY,
    partitionKey: 'pk',
    sortKey: 'sk',
    DocumentClient: dbClient
  });

function schemaEntity (schema){
  return new Entity({
    ...schema,
    table: tableConfig
  });
};

exports.Organization = schemaEntity(orgs);