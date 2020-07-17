// orgsUpdate.js 
const { Organization } = require("dal-dynamodb");
exports.handler = async function (event, ctx, errCb, console) {
    let key = {
        ...event.args.input
    }
    let condition = {
        exists: true
    }
 
    try {
        let res = await Organization.update(key, condition);
        // TODO - add check for isEmpty
        return item;
    }
    catch (e) {
        // console.log(e);
        return errCb('Cannot update organization');
    }
};