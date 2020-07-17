// orgsList.js

const { Organization } = require("dal-dynamodb");
exports.handler = async function (event, ctx, errCb) {
    console.log("CONTEXT", ctx)
    console.log("EVENT", event)
    let orgId = 'ORG1';
    try {
        let res = await Organization.query(orgId);
        // TODO - add check for isEmpty
        return res.Items;
    }
    catch (e) {
        // console.log(e);
        return errCb('Cannot list all organizations');
    }
};