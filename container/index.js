const {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("node:fs/promises");
const fsOld = require("node:fs");
const path = require("node:path");

const ffmpeg = require("fluent-ffmpeg");

const RESOLUTIONS = [
    { name: "360p", width: 480, height: 360 },
    { name: "480p", width: 858, height: 480 },
    { name: "720p", width: 1280, height: 720 },
];

const s3Client = new S3Client({
    region: "",
    credentials: {
        accessKeyId: "",
        secretAccessKey: "",
    },
});

// env
const BUCKET = process.env.BUCKET;
const KEY = process.env.KEY;

async function init() {
    // Download the original video
    const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: KEY,
    });

    const result = await s3Client.send(command);
    const originalFilePath = path.basename(KEY);

    await fs.writeFile(originalFilePath, result.Body);

    const originalVideoPath = path.resolve(originalFilePath);
    const originalFileName = path.parse(originalFilePath).name;

    // Start the transcoder
    const promises = RESOLUTIONS.map((resolution) => {
        const output = `${originalFileName}-video-${resolution.name}.mp4`;

        return new Promise((resolve) => {
            ffmpeg(originalVideoPath)
                .output(output)
                .withVideoCodec("libx264")
                .withAudioCodec("aac")
                .withSize(`${resolution.width}x${resolution.height}`)
                .on("end", async () => {
                    const putCommand = new PutObjectCommand({
                        Bucket: "production.sandesh.xyz",
                        Key: output,
                        Body: fsOld.createReadStream(path.resolve(output)),
                    });
                    await s3Client.send(putCommand);
                    console.log(`Uploaded ${output}`);
                    resolve(output);
                })
                .format("mp4")
                .run();
        });
    });

    await Promise.all(promises);
    process.exit();
}

init();
