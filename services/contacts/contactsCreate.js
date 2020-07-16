const { Contact } = require("./dal-dynamodb");
exports.handler = async function (event, ctx, errCb) {
    let contact = {
        firmId: '1',
        contactId: Math.random().toString(16).slice(2, 8),
        ...event.args.input
    }
    try {
        let res = await Contact.put(contact);
        console.log('res from put:>> ', res);
        // TODO - add check for isEmpty
        return contact;
    }
    catch (e) {
        console.log(e);
        return errCb('Cannot create contact');
    }
};