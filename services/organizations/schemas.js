"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.orgs = {
    name: 'Organization',
    attributes: {
        orgId: { partitionKey: true, prefix: 'ORG' },
        firmId: { sortKey: true },
        alt_address: { type: 'list' },
        prim_address: { type: 'list' },
        email: { type: 'string' },
        fax: { type: 'string' },
        telephone: { type: 'string' },
        creation_date: { type: 'string' },
        entity_name: { type: 'string' },
        entity_namechange_date: { type: 'string' },
        entity_namechange_reason: { type: 'string' },
        entity_namechange_reason: { type: 'string' },
        entity_number: { type: 'string' },
        jurisdiction: { type: 'string' }
    }
};


