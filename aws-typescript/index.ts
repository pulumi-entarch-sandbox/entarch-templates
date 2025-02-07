import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumiservice from "@pulumi/pulumiservice";

const config = new pulumi.Config();

const pulumiStackTeam = config.get("pulumiStackTeam") || "DevTeam";

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.BucketV2("my-bucket");

export const bucketName = bucket.id;

const hoursToAdd = 8;
const expirationTime = new Date(Date.now() + hoursToAdd * 60 * 60 * 1000).toISOString().slice(0, -7) + "00Z";

new pulumiservice.TtlSchedule(
    `${pulumi.getProject}-ttlschedule`,
    {
        organization: pulumi.getOrganization(),
        project: pulumi.getProject(),
        stack: pulumi.getStack(),
        timestamp: expirationTime,
        deleteAfterDestroy: false,
    },
    { ignoreChanges: ["timestamp"], retainOnDelete: true },
);

new pulumiservice.TeamStackPermission(
    `${pulumi.getProject}-team-stack-assign`,
    {
        organization: pulumi.getOrganization(),
        project: pulumi.getProject(),
        stack: pulumi.getStack(),
        team: pulumiStackTeam,
        permission: pulumiservice.TeamStackPermissionScope.Admin,
    },
    { retainOnDelete: true },
);
