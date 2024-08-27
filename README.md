
# Video Transcoding Pipeline
This project is an automated video transcoding pipeline built using AWS services. It processes uploaded videos by converting them into multiple resolutions to ensure compatibility across different devices and network conditions. The pipeline is designed to be scalable, secure, and efficient, leveraging the power of containerization and cloud computing.

# Features
* Automated video transcoding to multiple resolutions (360p, 480p, 720p).
* Scalable and secure processing using AWS ECS and Docker containers.
* Real-time processing triggered by file uploads to AWS S3.
* Efficient storage management by uploading transcoded videos back to S3.
* Fully automated from video upload to transcoding and storage.

# Architecture
The pipeline architecture consists of the following components:

* AWS S3: Used for storing uploaded videos and the transcoded output.
* AWS SQS: Receives event notifications from S3 and queues them for processing.
* AWS ECS: Runs Docker containers that handle the video transcoding process.
* FFmpeg: The tool used within Docker containers to transcode videos into multiple resolutions.

# Workflow
    1. Video Upload: A user uploads a video to an S3 bucket.

    2. SQS Event: The S3 bucket triggers an event notification to an SQS queue.

    3. Polling: Multiple consumers (Docker containers) poll the SQS queue for new messages
    
    3. a) When a message is polled, it becomes invisible to other consumers for 1 minute.
    
    4. Transcoding: The SNS event initiates an ECS task, spinning up a Docker container to transcode the video.

    5. Storage: The transcoded videos are automatically uploaded back to the S3 bucket.

    6. Access: The user can download the transcoded videos from the provided links.

# Tech Stack
* Amazon S3: Storage for raw and transcoded videos.
* Amazon SQS: Queue service to manage and distribute event notifications.
* Amazon ECS: Container orchestration service for running Docker containers.
* Docker: Containers for isolated and reproducible transcoding environments.
* FFmpeg: Command-line tool for video processing and transcoding.

# Setup
> Prerequisites
* AWS Account
* Docker installed locally
* AWS CLI configured


# Usage
* Upload a video file to the designated S3 bucket.
* Wait for the transcoding process to complete (check ECS task logs for progress).
* Download the transcoded videos from the S3 bucket.

# Contributing
Contributions are welcome! Please fork this repository and submit a pull request with your proposed changes.
