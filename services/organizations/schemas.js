"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.org = {
    name: 'Org',
    attributes: {
        id: { partitionKey: true, prefix: 'ORG' },
        type: { sortKey: true },// 'firm', 'entity', 'unmanaged'
        email: { type: 'string' }
    }
};