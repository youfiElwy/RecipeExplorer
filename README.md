# RecipeExplorer 🍴

**RecipeExplorer** is a full-stack web application built using the **MERN stack** (MongoDB, Express.js, React, Node.js) and hosted entirely on **AWS**. The project demonstrates the power of AWS cloud services for building scalable, secure, and high-performance applications. Below is a detailed breakdown of how AWS services are utilized in this project.

![AWS VPC Diagram](https://github.com/user-attachments/assets/3b27ead8-b22e-460c-8275-ebb802c291e5)
---

## AWS Services Utilized 🛠️

### 1. **Amazon S3 (Simple Storage Service)**
   - **Purpose**: Store recipe images (e.g., `recipeImage` field in the Recipe schema).
   - **Implementation**:
     - Images uploaded by users are stored in an S3 bucket.
     - Each image is assigned a unique URL, which is stored in DynamoDB.
   - **Benefits**:
     - Scalable and durable object storage.
     - Integrated with **CloudFront** for fast content delivery.

### 2. **Amazon DynamoDB**
   - **Purpose**: Store user and recipe data.
   - **Implementation**:
     - Two tables are created:
       - `User`: Stores user information (`userID`, `userName`, `email`, `password`).
       - `Recipe`: Stores recipe details (`recipeID`, `userID`, `title`, `description`, `ingredients`, `category`, `upvotes`, `recipeImage`).
   - **Benefits**:
     - Fully managed NoSQL database.
     - High performance with low latency.
     - Auto-scaling based on demand.

### 3. **AWS Lambda**
   - **Purpose**: Serverless functions for backend operations.
   - **Implementation**:
     - Lambda functions are used for:
       - Recipe CRUD operations (create, read, update, delete).
   - **Benefits**:
     - Pay-as-you-go model.
     - Automatic scaling based on traffic.

### 4. **Amazon CloudFront**
   - **Purpose**: Content delivery network (CDN) for serving static assets.
   - **Implementation**:
     - CloudFront is configured to distribute recipe images stored in S3.
     - Ensures low-latency access to users globally.
   - **Benefits**:
     - Faster content delivery.
     - Reduced load on the origin server (S3).

### 5. **Amazon EC2 (Elastic Compute Cloud)**
   - **Purpose**: Host the MERN stack application.
   - **Implementation**:
     - The backend (Node.js/Express.js) and frontend (React) are hosted on EC2 instances.
     - An **AMI (Amazon Machine Image)** is created for quick deployment.
   - **Benefits**:
     - Scalable compute capacity.
     - Full control over the virtual server environment.

### 6. **AWS IAM (Identity and Access Management)**
   - **Purpose**: Manage permissions and roles for AWS resources.
   - **Implementation**:
     - IAM roles and policies are created to grant access to:
       - S3 buckets for image uploads.
       - DynamoDB tables for data storage.
       - Lambda functions for execution.
   - **Benefits**:
     - Fine-grained access control.
     - Enhanced security for AWS resources.

### 7. **Amazon CloudWatch**
   - **Purpose**: Monitoring and auditing.
   - **Implementation**:
     - CloudWatch is used to monitor:
       - Lambda function performance.
       - EC2 instance health.
       - API Gateway metrics.
   - **Benefits**:
     - Real-time insights into application performance.
     - Automated alerts for anomalies.

### 8. **AWS VPC (Virtual Private Cloud)**
   - **Purpose**: Isolate and secure the application infrastructure.
   - **Implementation**:
     - A VPC is created with:
       - Public and private subnets.
       - An **Internet Gateway** for external communication.
       - **Security Groups** to control inbound/outbound traffic.
   - **Benefits**:
     - Enhanced network security.
     - Isolation of resources.

### 9. **Auto Scaling Groups (ASG) and Elastic Load Balancer (ELB)**
   - **Purpose**: Ensure high availability and scalability.
   - **Implementation**:
     - ASG is configured to automatically scale EC2 instances based on traffic.
     - ELB distributes incoming traffic across multiple EC2 instances.
   - **Benefits**:
     - Improved fault tolerance.
     - Seamless handling of traffic spikes.

### 10. **AWS SDK**
   - **Purpose**: Integrate AWS services with the application code.
   - **Implementation**:
     - The AWS SDK is used in the backend to interact with:
       - S3 for image uploads.
       - DynamoDB for data storage.
       - Lambda for serverless functions.
   - **Benefits**:
     - Simplified integration with AWS services.
     - Programmatic access to AWS resources.

---

## AWS Architecture Overview 🖼️

Below is a high-level architecture diagram of how AWS services are integrated into **RecipeExplorer**:

1. **Frontend**:
   - Hosted on **EC2** instances.
   - Served via **CloudFront** for low-latency delivery.

2. **Backend**:
   - RESTful APIs built with **Node.js/Express.js**.
   - Hosted on **EC2** instances.
   - Integrated with **Lambda** for serverless functions.

3. **Database**:
   - **DynamoDB** for storing user and recipe data.

4. **Storage**:
   - **S3** for storing recipe images.

5. **Networking**:
   - **VPC** for network isolation.
   - **Internet Gateway** for external communication.
   - **ELB** for load balancing.

6. **Monitoring**:
   - **CloudWatch** for performance monitoring and auditing.

---

## Key AWS Features Highlighted 🌟

- **Scalability**: Auto Scaling Groups (ASG) and Elastic Load Balancer (ELB) ensure the application can handle traffic spikes.
- **Security**: IAM roles, VPC, and Security Groups provide robust security for the application.
- **Cost Efficiency**: Pay-as-you-go pricing for Lambda, S3, and DynamoDB ensures cost optimization.
- **Performance**: CloudFront and ELB ensure low-latency access and high availability.

---

## Setup Instructions 🚀

### Prerequisites
- AWS account with necessary permissions.
- AWS CLI configured.

### Steps
1. **Set Up AWS Services**:
   - Create an S3 bucket for recipe images.
   - Set up DynamoDB tables for `User` and `Recipe`.
   - Configure IAM roles and policies.
   - Deploy Lambda functions for serverless operations.
   - Set up CloudFront for content delivery.
   - Launch EC2 instances and configure VPC, ASG, ELB, and Internet Gateway.

2. **Configure Environment Variables**:
   Create a `.env` file in the backend with the following variables:
   ```env
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   AWS_REGION=your-region
   S3_BUCKET_NAME=your-s3-bucket-name
   DYNAMODB_TABLE_USER=User
   DYNAMODB_TABLE_RECIPE=Recipe
   ```

3. **Deploy the Application**:
   - Use EC2 instances to host the backend and frontend.
   - Configure ELB and ASG for scalability.

---

This README highlights the **AWS-centric approach** of **RecipeExplorer**, showcasing how AWS services are leveraged to build a scalable, secure, and high-performance application.
