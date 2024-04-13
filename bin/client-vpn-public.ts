#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { publicClientVpnStack } from '../lib/vpcStack';

const app = new cdk.App();
new publicClientVpnStack(app, 'publicClientVpnStack', {
  stackName: 'publicClientVPNStack',
});