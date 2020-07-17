// orgsGet.js

const { Organization } = require("dal-dynamodb");
exports.handler = async function (event, ctx, errCb) {
    let orgId = 'ORG1';
    let { ID } = {...event.args.input}
    console.log('event from orgsGet :>> ', event);
    try {
        let res = await Organization.query(orgId);
        // TODO - add check for isEmpty
        return res.Items[0];
    }
    catch (e) {
        // console.log(e);
        return errCb('Cannot get the requested organizations');
    }
};