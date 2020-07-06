import * as cdk from '@aws-cdk/core';
import { GraphQLInfrastructure } from '../services/graphql_service/infrastructure';
import { ContactsInfrastructure } from '../services/contacts/infrastructure/contactsinfrastructure';

export class MicroservicesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const contactsInfrastructure = new ContactsInfrastructure(this, 'ContactsInfrastructure', {});

    const graphQL = new GraphQLInfrastructure(this, 'GraphQLInfrastructure', {
      contactService: contactsInfrastructure.handler,
    });

  }
}
