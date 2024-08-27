
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
---
![diagram-export-8-28-2024-12_23_05-AM](https://github.com/user-attachments/assets/59bdc951-6f6e-4f06-983b-5bc49a09296a)
---

# Workflow
![image](https://github.com/user-attachments/assets/a5b89587-49a4-4926-b4f7-ac65d5336c98)

---

1. Video Upload: A user uploads a video to an S3 bucket.
   ![image](https://github.com/user-attachments/assets/2e4a239f-9bb3-4c11-8959-39e042aec1e7)
---
3. SQS Event: The S3 bucket triggers an event notification to an SQS queue.
   ![image](https://github.com/user-attachments/assets/f621ffa7-63f3-47ae-852a-772b02f0d475)
---       
4. Polling: Multiple consumers (Docker containers) poll the SQS queue for new messages
    a) When a message is polled, it becomes invisible to other consumers for 1 minute.
        ![image](https://github.com/user-attachments/assets/aad0bea9-da24-4e4f-9a09-cc582a7eef77)
---    
5. Transcoding: The SNS event initiates an ECS task, spinning up a Docker container to transcode the video.
   ![image](https://github.com/user-attachments/assets/beea05be-5ac8-4610-a40c-3c1ad2abbf92)
---        
6. Storage: The transcoded videos are automatically uploaded back to the S3 bucket.
   ![image](https://github.com/user-attachments/assets/6f23367e-9ac7-4b5e-a1e0-c3cce40cec15)
---
7. Access: The user can download the transcoded videos from the provided links.
   ![image](https://github.com/user-attachments/assets/05f165ab-d6ad-4c85-a9e1-96ebd57b6c3d)

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
