module.exports = {
  contactsList: {
    pathFromRoot: 'services/contacts',
    resolvers: [
      {
        typeName: 'Query',
        fieldName: 'listAllContacts'
      }
    ]
  },
  contactsGet: {
    pathFromRoot: 'services/contacts',
    resolvers: [
      {
        typeName: 'Query',
        fieldName: 'getContactById'
      }
    ]
  },
  contactsCreate: {
    pathFromRoot: 'services/contacts',
    resolvers: [
      {
        typeName: 'Mutation',
        fieldName: 'createContact'
      }
    ]
  },

  orgsList: {
    pathFromRoot: 'services/organizations',
    resolvers: [
      {
        typeName: 'Query',
        fieldName: 'listAllOrgs'
      },
    ]
  },
  orgsGet: {
    pathFromRoot: 'services/organizations',
    resolvers: [
      {
        typeName: 'Query',
        fieldName: 'getOrgById'
      },
    ]
  },
  orgsCreate: {
    pathFromRoot: 'services/organizations',
    resolvers: [
      {
        typeName: 'Mutation',
        fieldName: 'createOrg'
      },
    ]
  },
}