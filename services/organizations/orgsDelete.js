// orgsDelete.js 
const { Organization } = require("dal-dynamodb");
exports.handler = async function (event, ctx, errCb, console) {
    let key = {
        orgId: '1',
        ...event.args.input
    }
 
    try {
        let res = await Organization.delete(key);
        // TODO - add check for isEmpty
        // return key;
        return key
    }
    catch (e) {
        // console.log(e);
        return errCb('Cannot delete organization');
    }
};