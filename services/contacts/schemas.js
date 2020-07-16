"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.contacts = {
    name: 'Contact',
    attributes: {
        firmId: { partitionKey: true, prefix: 'CONTACT' },
        contactId: { sortKey: true, prefix: 'META' },
        email: { type: 'string' }
    }
};