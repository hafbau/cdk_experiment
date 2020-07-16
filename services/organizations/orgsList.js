// orgsList.js

const { Contact } = require("./dal-dynamodb");
exports.handler = async function (event, ctx, errCb) {
    console.log("CONTEXT", ctx)
    console.log("EVENT", event)
    let firmId = '1';
    try {
        let res = await Contact.query(firmId);
        // TODO - add check for isEmpty
        return res.Items;
    }
    catch (e) {
        console.log(e);
        return errCb('Cannot list all contacts');
    }
};