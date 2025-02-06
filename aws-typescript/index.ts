import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { StackSettings } from "./stackSettings";

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.BucketV2("my-bucket");

// Export the name of the bucket
export const bucketName = bucket.id;

const stackSettings = new StackSettings("my-stack-settings", {
    driftManagement: "True",
});
