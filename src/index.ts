import {DeleteMessageCommand, ReceiveMessageCommand, SQSClient} from "@aws-sdk/client-sqs"
import type{S3Event} from 'aws-lambda'
import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs'

const client = new SQSClient({
    region: '',
    credentials: {
        accessKeyId:"",
        secretAccessKey:"",
    }
})

const ecsClient = new ECSClient({
    region: '',
    credentials: {
        accessKeyId:"",
        secretAccessKey:"",
    }
})

async function init() {
    const command = new ReceiveMessageCommand({
        QueueUrl: "",
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20,
    })

    while(true) {
        const {Messages} = await client.send(command);
        if(!Messages) {
            console.log("No Message in Queue")
            continue;
        }

        try {
            for(const message of Messages) {
                const {MessageId, Body} = message;
                console.log(`Message Received: `, {MessageId, Body})
    
                if(!Body) continue;
    
                // Validate and parse the event
                const event = JSON.parse(Body) as S3Event;
                
                // Ignore the test event
                if("Service" in event && "Event" in event) {
                    if(event.Event === "s3:TestEvent") {
                        await client.send(new DeleteMessageCommand({
                            QueueUrl: '',
                            ReceiptHandle: message.ReceiptHandle,
                        }));
                        continue;
                    }
                }

                for(const record of event.Records) {
                    const {s3} = record;
                    const {bucket, object:{key}} = s3;
                    // Spin the docker Container
                    const runTaskCommand = new RunTaskCommand({
                        taskDefinition: '',
                        cluster: '',
                        launchType: "FARGATE",
                        networkConfiguration: {
                            awsvpcConfiguration: {

                                assignPublicIp:"ENABLED",
                                securityGroups: ["sg-0575ab44b0ab2cf9c"],
                                subnets: ["subnet-0cfb93880acdf91e0", "subnet-05c83782d90e695d1", "subnet-0476e39ea6998a7e2"] 
                            }
                        },
                        overrides: {
                            containerOverrides: [
                                {
                                    name: "video-transcoder",
                                    environment: [
                                        {name:"BUCKET", value: bucket.name},
                                        {name:"KEY", value:key},
                                    ]
                                }
                            ]
                        }
                    })
                    await ecsClient.send(runTaskCommand);
                    // Delete the message from Queue
                    await client.send(new DeleteMessageCommand({
                        QueueUrl: '',
                        ReceiptHandle: message.ReceiptHandle,
                    }))
                }


    
            }
        }
        catch(err){
            console.log(err)
        }
    }
}

init()