const uuid = require("uuid/v5");
const { Contact, Affiliation } = require("dal-dynamodb");
const {
    AFFILIATE_TYPE,
    AFFILIATION,
    AFFILIATION_TYPE
} = require("affiliation-types");
exports.handler = async function (event, ctx, errCb) {
    let contact = {
        id: uuid(),
        ...event.args.input
    }
    try {
        let res = await Contact.put(contact);
        await Affiliation.put({
            affiliateId: contact.id,
            affiliateType: AFFILIATE_TYPE.CONTACT,
            affiliatedId: '1', // firmId
            affiliatedType: AFFILIATE_TYPE.FIRM,
            affiliation: AFFILIATION.CONTACT_MEMBER,
            affiliationType: AFFILIATION_TYPE.CONTACT
        })
        // TODO - add check for isEmpty
        return contact;
    }
    catch (e) {
        console.log(e);
        return errCb('Cannot create contact');
    }
};