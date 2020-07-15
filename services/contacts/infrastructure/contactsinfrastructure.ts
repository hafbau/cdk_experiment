import { join } from 'path';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';


export class ContactsInfrastructure extends cdk.Construct {
  public readonly handler: lambda.Function;

  public readonly table: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props: any) {
    super(scope, id);

    const table = new dynamodb.Table(this, 'Contacts', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING }
    });
    this.table = table;

    this.handler = new lambda.Function(this, 'ContactsHandler', {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'contacts.handler',
        code: lambda.Code.fromAsset(join(__dirname, '../src')),
        environment: {
            TABLE_ENTITY: table.tableName
        }
    });

    // grant the lambda role read/write permissions to our table
    table.grantReadWriteData(this.handler);
  }
}