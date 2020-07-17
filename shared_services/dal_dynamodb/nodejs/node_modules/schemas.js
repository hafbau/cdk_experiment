"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.contacts = {
    name: 'Contact',
    attributes: {
        firmId: { partitionKey: true, prefix: 'CONTACT' },
        contactId: { sortKey: true, prefix: 'META' },
        firstName: { type: 'string' },
        middleName: { type: 'string' },
        lastName: { type: 'string' },
        primaryEmail: { type: 'string' },
        alternateEmail: { type: 'string' },
        primaryAddress: { type: 'string' },
        alternateAddress: { type: 'string' },
        residency: { type: 'string' },
        alias: { type: 'string' },
        telephone: { type: 'string' },
        fax: { type: 'string' },
    }
};