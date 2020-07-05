import * as cdk from '@aws-cdk/core';
import { GraphQLInfrastructure } from '../services/graphql_service/infrastructure';

export class MicroservicesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const graphQL = new GraphQLInfrastructure(this, 'GraphQLInfrastructure', {})

  }
}
