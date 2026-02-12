# Deployment Guide - Namma Elampillai

This guide details how to deploy the Namma Elampillai application to AWS Lightsail Containers.

## Prerequisites

1.  **AWS Account**: You need an active AWS account.
2.  **AWS CLI**: Installed and configured with your credentials.
3.  **Lightsail Control Plugin**: Install the `lightsailctl` plugin to push container images.
4.  **Docker**: Installed and running locally.

## Step 1: Build the Docker Image

Build the production-ready Docker image for the `linux/amd64` platform (required for AWS Lightsail).

```bash
docker build --platform linux/amd64 -t namma-elampillai .
```

*Note: If you are on Windows/Mac, the `--platform linux/amd64` flag is crucial to ensure compatibility with Lightsail's Linux environment.*

## Step 2: Create a Lightsail Container Service

1.  Log in to the [AWS Lightsail Console](https://lightsail.aws.amazon.com/).
2.  Go to the **Containers** tab.
3.  Click **Create container service**.
4.  Choose a region (e.g., `ap-south-1` for Mumbai).
5.  Choose a scale (e.g., **Nano** or **Micro** is usually sufficient for starting).
6.  Give your service a name, e.g., `namma-elampillai-service`.
7.  Click **Create container service**.

## Step 3: Push the Image to Lightsail

Once the service is created, you need to push your local image to it.

1.  Get the text for the push command from the Lightsail console logic, or use the generic structure:

```bash
# Login to Lightsail container services
aws lightsail push-container-image --service-name namma-elampillai-service --label namma-elampillai --image namma-elampillai
```

*Note: This command will upload the image. It might take a few minutes depending on your internet speed.*

2.  After the push is successful, you will see a generic image name like `:namma-elampillai.namma-elampillai.1`. Copy this name.

## Step 4: Configure and Deploy

1.  Go back to your Lightsail Container Service in the console.
2.  Click **Deployments** -> **Create your first deployment**.
3.  **Container name**: `namma-elampillai-app`
4.  **Image**: Paste the image name from Step 3 (e.g., `:namma-elampillai.namma-elampillai.1`).
5.  **Environment Variables**: Add your production keys here:
    *   `MONGODB_URI`: `mongodb+srv://...`
    *   `GMAIL_USER`: `...`
    *   `GMAIL_APP_PASSWORD`: `...`
    *   `NEXT_PUBLIC_BASE_URL`: (Your Lightsail public domain or custom domain)
6.  **Open Ports**: Click **Add open port** and specify `3000` (HTTP).
7.  **Public Endpoint**: Select the `namma-elampillai-app` container and port `3000`.
8.  Click **Save and deploy**.

## Step 5: Seeding Production Data (Optional)

If you need to seed the production database:

1.  Modify your local `.env.local` to point `MONGODB_URI` to your production database temporarily.
2.  Run the seed script locally:
    ```bash
    node --env-file=.env.local scripts/seed.js
    ```
3.  **IMPORTANT**: Revert your local `.env.local` back to localhost afterwards to avoid accidentally writing to production during development.

## Troubleshooting

-   **Logs**: Use the **Logs** tab in the Lightsail service console to see application logs if the service fails to start.
-   **Health Check**: Ensure your app responds to `GET /` with a 200 OK status.
