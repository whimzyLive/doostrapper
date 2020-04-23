import { StackProps } from '@aws-cdk/core';
import { NOTIFICATIONS_TARGET, NOTIFICATIONS_TYPE } from './constants/enums';
import { PriceClass } from '@aws-cdk/aws-cloudfront';

/**
 * @param artifactsBucketConfig Artifacts bucket related config
 * @param pipelineConfig Deploy pipeline related config
 * @param notificationConfig Deployment notifications related config
 */
export interface IBackendDeploymentProps extends StackProps {
  /**
   * @default - Dootstrapper specific config is applied
   */
  artifactsBucketConfig?: IBackendArtifactsBucketProps;
  pipelineConfig: IBackendPipelineProps;
  notificationConfig: INotificationConfigProps;
}

/**
 * @param bucketName Artifacts bucket name
 * It is recommended not to have user defined bucket name
 * Bucket name needs to be unique across all accounts.
 * @param versioned this bucket should have versioning turned on or not.
 */
interface IBackendArtifactsBucketProps {
  /**
   * @default - Cloudformation generated bucket name
   */
  bucketName?: string;
}

/**
 * @param artifactsSourceKey s3 path where artifacts will be uploaded to, including suffix
 * @param environments environment related config
 */
export interface IBackendPipelineProps {
  /**
   * @default - AWS CloudFormation generates an ID and uses that for the pipeline name
   */
  artifactsSourceKey: string;
  /**
   * @default - Pipeline Execution events
   */
  notificationsType: NOTIFICATIONS_TYPE;

  environments: IBackendEnvironment[];
}

/**
 * @param name Environment name
 * @param adminPermissions Should admin permission be created with accessKey and Secret injected into container
 * @param privilegedMode Enable this flag if you want to build Docker images or
 * want your builds to get elevated privileges
 * @param approvalRequired Manual approval to add before deploy action
 * @param runtimeVariables Runtime variables to inject into container
 * @param buildSpec BuildSpec file to execute on codebuild
 */
export interface IBackendEnvironment {
  name: string;
  /**
   * @default - No admin access is created, developer must provide accessKeyId and secretAccessKey in SSM
   */
  adminPermissions?: boolean;
  /**
   * @default false
   */
  privilegedMode?: boolean;
  /**
   * @default - No approval action is added
   */
  approvalRequired?: boolean;
  /**
   * @default - No environment variables are passed to pipeline
   */
  runtimeVariables?: { [key: string]: string };
  buildSpec: any;
}

/**
 * @param topicName Name of SNS Topic resource
 * @param notificationsType Type of notifications to receive
 * @param notificationsTargetConfig  Notifications Target Configurations
 * @param cloudwatchRuleName Cloudwatch events rule name
 */
export interface INotificationConfigProps {
  notificationsTargetConfig: INotificationsEmailTargetConfig;
}

/**
 * @param targetType Type of target
 * @param emailAddress Email to send notifications to
 */
interface INotificationsEmailTargetConfig {
  targetType: NOTIFICATIONS_TARGET.EMAIL;
  emailAddress: string;
}

export interface IFrontendDeploymentProps extends StackProps {
  baseDomainName: string;
  pipelineConfig: IFrontendPipelineConfig;
  notificationConfig: INotificationConfigProps;
}

export interface IFrontendPipelineConfig {
  artifactsSourceKey: string;
  /**
   * @default - Pipeline Execution events
   */
  notificationsType: NOTIFICATIONS_TYPE;
  environments: IFrontendEnvironment[];
}

interface IFrontendEnvironment {
  name: string;
  aliases: string[];
  cloudfrontPriceClass?: PriceClass;
  approvalRequired?: boolean;
  defaultRootObject?: string;
  errorRootObject?: string;
}
