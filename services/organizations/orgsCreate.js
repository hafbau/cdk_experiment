// orgsCreate.js 
const { Organization } = require("./dal-dynamodb");
exports.handler = async function (event, ctx, errCb) {
    let org = {
        orgId: '1',
        firmId: Math.random().toString(16).slice(2, 8),
        ...event.args.input
    }
    try {
        let res = await Organization.put(org);
        console.log('res from put:>> ', res);
        // TODO - add check for isEmpty
        return contact;
    }
    catch (e) {
        console.log(e);
        return errCb('Cannot create organization');
    }
};