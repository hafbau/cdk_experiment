const { Contact } = require("./dal-dynamodb");
exports.handler = async function (event, ctx, errCb) {
    let firmId = 'CONTACT1';
    console.log('ctx.arguments from getContact :>> ', ctx.arguments);
    try {
        let res = await Contact.query(firmId);
        // TODO - add check for isEmpty
        return res.Items[0];
    }
    catch (e) {
        console.log(e);
        return errCb('Cannot list all contacts');
    }
};