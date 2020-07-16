"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.orgs = {
    name: 'Organization',
    attributes: {
        orgId: { partitionKey: true, prefix: 'ORG' },
        firmId: { sortKey: true },
        name: { type: 'string' }
    }
};