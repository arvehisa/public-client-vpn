import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class publicClientVpnStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      vpcName: "publicClientVpnVpc",
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          name: 'public-subnet',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24
        }
      ],
    });

    const securityGroup = new ec2.SecurityGroup(this, 'publicClientVpnSG', {
      allowAllOutbound: true,
      securityGroupName: 'publicClientVPNSG',
      vpc,
    });

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic(), 'Allow all inbound traffic');

    const clientCidr = '1.0.0.0/22'
    const serverCertificateArn = 'arn:aws:acm:us-east-1:618044871166:certificate/e6754345-c2c4-44f8-b4b1-43e28d6a7b03'
    const clientCertificateArn = 'arn:aws:acm:us-east-1:618044871166:certificate/987d5ae8-2686-4b7a-be67-4b85ae468c99'

    const clientVpnEndpoint = new ec2.ClientVpnEndpoint(this, 'ClientVpn', {
      vpc: vpc,
      cidr: clientCidr,
      serverCertificateArn: serverCertificateArn,
      clientCertificateArn: clientCertificateArn,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      securityGroups: [securityGroup],
      description: 'Client VPN Endpoint',
      splitTunnel: false
    });
  }
}

