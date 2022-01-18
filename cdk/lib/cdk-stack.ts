import * as cdk from '@aws-cdk/core';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as path from 'path';
import * as ecs from '@aws-cdk/aws-ecs'; // 1
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns'; // 2 
import { CoreDnsComputeType } from 'aws-cdk-lib/aws-eks';


export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const asset = new DockerImageAsset(this, "build_uploader", {
      directory: path.resolve(__dirname, "../.."),
      exclude: ["cdk", "cdk.out"],
    });

    const cluster = new ecs.Cluster(this, "Cluster", { // 3
      clusterName: "SoldablesCluster",
    });

    new ecsPatterns.ApplicationLoadBalancedFargateService( // 4
      this,
      "SoldablesFargate",
      {
        cluster, // 5
        memoryLimitMiB: 512, // 6
        desiredCount: 1, // 7
        serviceName: "soldables", // 8
        taskImageOptions: {
          image: ecs.ContainerImage.fromDockerImageAsset(asset), // 9
          containerPort: 8080, // 10
        },
        publicLoadBalancer: true, // 11
      }
    );
  }
}