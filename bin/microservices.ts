#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MicroservicesStack } from '../lib/microservices-stack';

const app = new cdk.App();
new MicroservicesStack(app, 'MicroservicesStack');
