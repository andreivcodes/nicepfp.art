import { Bucket, NextjsSite, Queue, RDS, Service, StackContext } from "sst/constructs";
import { config as dotenv_config } from "dotenv";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Duration } from "aws-cdk-lib/core";


export function stack({ stack }: StackContext) {
  dotenv_config();

  let nicepfp_certificate = Certificate.fromCertificateArn(stack, "8b46a316-7de2-44c5-b8e9-391c8e488d7e", "arn:aws:acm:us-east-1:339712735172:certificate/8b46a316-7de2-44c5-b8e9-391c8e488d7e");

  stack.setDefaultFunctionProps({
    logRetention: "one_day",
    tracing: "disabled",
    memorySize: "1 GB",
    architecture: "arm_64",
    runtime: "nodejs18.x",
  });

  const db = new RDS(stack, "Database", {
    engine: "postgresql13.9",
    defaultDatabaseName: "gitshow_db",
    migrations: "libs/db/migrations",
  });

  const mint = new Queue(stack, "Mint", {
    cdk: {
      queue: {
        visibilityTimeout: Duration.minutes(5)
      }
    },
    consumer: {
      function: {
        handler: "packages/frame_images/src/mint.handler",
        environment: {
          PRIVATE_KEY: process.env.PRIVATE_KEY ?? ""
        },
        nodejs: {
          install: ["ipfs-utils", "eth-crypto"]
        },
        timeout: "5 minutes",
        bind: [db]
      },
      cdk: {
        eventSource: {
          batchSize: 1,
        },
      },
    }
  })

  const generate_image = new Queue(stack, "GenerateImage", {
    cdk: {
      queue: {
        visibilityTimeout: Duration.minutes(5)
      }
    },
    consumer: {
      function: {
        handler: "packages/frame_images/src/generate_image.handler",
        environment: {
          IPFS_PROJECT_SECRET:
            process.env.IPFS_PROJECT_SECRET ?? "",
          IPFS_PROJECT_ID:
            process.env.IPFS_PROJECT_ID ?? "",
          PRIVATE_KEY: process.env.PRIVATE_KEY ?? ""
        },
        nodejs: {
          install: ["ipfs-utils", "eth-crypto"]
        },
        timeout: "5 minutes",
        bind: [db]
      },
      cdk: {
        eventSource: {
          batchSize: 1,
        },
      },
    }
  });


  const web = new NextjsSite(stack, "web", {
    path: "packages/web",
    memorySize: "2 GB",
    warm: 20,
    imageOptimization: {
      memorySize: "2 GB",
    },
    environment: {
      IPFS_PROJECT_SECRET:
        process.env.IPFS_PROJECT_SECRET ?? "",
      IPFS_PROJECT_ID:
        process.env.IPFS_PROJECT_ID ?? "",
      NEXT_PUBLIC_INFURA: process.env.NEXT_PUBLIC_INFURA ?? "",
      PRIVATE_KEY: process.env.PRIVATE_KEY ?? ""
    },
    customDomain: {
      domainName:
        "nicepfp.art",
      isExternalDomain: true,
      cdk: {
        certificate: nicepfp_certificate
      },
    },
    bind: [db, generate_image, mint]
  });

  stack.addOutputs({
    webUrl: web.url,
    webCustomUrl: web.customDomainUrl,
  });
}
