const { DynamoDB, Lambda } = require('aws-sdk');

exports.handler = async function(event: any) {
  console.log("request:", JSON.stringify(event, undefined, 2));
  const resp = [
    {
      id: 5678909,
      firstName: 'Matin',
      lastName: 'Suara',
      street: '103 Cyprus Villas',
      email: 'mrWat@email.roblox.com'
    },
    {
      id: 234,
      firstName: 'Hafiz',
      lastName: 'Suara',
      street: 'None of your business',
      email: 'trainWatz@blah.shush'
    }
  ]

  // return response back to upstream caller
  return resp;
};
