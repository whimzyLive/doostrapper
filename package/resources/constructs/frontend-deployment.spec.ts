import { HostedZone } from '@aws-cdk/aws-route53';
import { Stack, App } from '@aws-cdk/core';
import { FrontendDeployment } from './frontend-deployment';
import {
  NOTIFICATIONS_TARGET,
  NOTIFICATIONS_TYPE,
  DOMAIN_NAME_REGISTRAR,
} from '../enums';
import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
const frontEndMinConfig = require('./test/frontend-stack.json');

describe('FrontendDeployment', () => {
  let stack: Stack;

  beforeAll(() => {
    const app = new App();
    stack = new Stack(app, 'Stack');
    spyOn(HostedZone, 'fromLookup').and.returnValue(
      new HostedZone(stack, 'HostedZone', {
        zoneName: 'example.com',
      })
    );

    new FrontendDeployment(stack, 'FrontendDeployment', {
      baseDomainName: 'example.com',
      hostedZoneId: 'ZONE_ID',
      notificationConfig: {
        notificationsTargetConfig: {
          emailAddress: 'support@example.com',
          targetType: NOTIFICATIONS_TARGET.EMAIL,
        },
      },
      pipelineConfig: {
        artifactsSourceKey: 'path/to/artifact.zip',
        notificationsType: NOTIFICATIONS_TYPE.PIPELINE_EXECUTION,
        environments: [
          {
            aliases: ['app.example.com'],
            name: 'prod',
            assetsAliases: ['assets.example.com'],
            domainNameRegistrar: DOMAIN_NAME_REGISTRAR.AWS,
          },
        ],
      },
    });
  });

  it('should create', () => {
    expectCDK(stack).toMatch(frontEndMinConfig);
  });

  it('should create email subscription', () => {
    expectCDK(stack).to(
      haveResource('AWS::SNS::Subscription', {
        Protocol: 'email',
        Endpoint: 'support@example.com',
      })
    );
  });
});
