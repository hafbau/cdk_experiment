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
}