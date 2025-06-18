# Onboarding Wizard Setup Guide

This document provides setup instructions for the onboarding wizard feature that was built according to the specifications.

## Features Implemented

### ✅ Core Features
- **6-step onboarding wizard** with progress tracking
- **Company profile management** with rich text editing
- **Document upload system** for capability statements, resumes, and proposals
- **Secure admin dashboard** with user isolation
- **Content indexing framework** (ready for vector database integration)
- **File management system** with S3 integration
- **Authentication & authorization** using Auth0
- **Responsive design** with Tailwind CSS

### ✅ Security Features
- User data isolation based on Auth0 user ID
- JWT token validation on all API endpoints
- S3 presigned URLs with 15-minute expiration
- File type and size validation
- Input sanitization and validation with Zod

### ✅ Technical Architecture
- **Frontend**: Next.js 14 with TypeScript and React
- **Backend**: Next.js API routes with middleware
- **Database**: DynamoDB with proper schemas
- **File Storage**: AWS S3 with presigned URLs
- **Authentication**: Auth0 integration
- **UI Components**: Headless UI, Heroicons, TipTap editor

## Environment Setup

1. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure Auth0:**
   - Create an Auth0 application
   - Set up allowed callback URLs: `http://localhost:3000/api/auth/callback`
   - Set up allowed logout URLs: `http://localhost:3000`
   - Update `.env.local` with Auth0 credentials

3. **Configure AWS:**
   - Create AWS access keys with DynamoDB and S3 permissions
   - Create S3 bucket for document storage
   - Update `.env.local` with AWS credentials

4. **Install dependencies:**
   ```bash
   npm install
   ```

## Database Setup

### DynamoDB Tables

Create the following DynamoDB tables:

#### 1. Users Table (`onboarding-users`)
- **Partition Key**: `userId` (String)
- **Attributes**: userId, email, companyDescription, companyWebsite, onboardingCompleted, onboardingSkipped, createdAt, updatedAt

#### 2. Documents Table (`onboarding-documents`)
- **Partition Key**: `userId` (String)  
- **Sort Key**: `documentId` (String)
- **Attributes**: userId, documentId, documentType, fileName, s3Key, fileSize, mimeType, indexed, uploadedAt

#### 3. Indexing Jobs Table (`onboarding-indexing-jobs`)
- **Partition Key**: `userId` (String)
- **Sort Key**: `jobId` (String)
- **Attributes**: userId, jobId, status, startedAt, completedAt, documentsProcessed, error

### S3 Bucket Setup

1. Create an S3 bucket for document storage
2. Configure bucket policies for security:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "AWS": "arn:aws:iam::YOUR_ACCOUNT:user/YOUR_USER"
         },
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::YOUR_BUCKET/*"
       }
     ]
   }
   ```

## Development

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - Main site: `http://localhost:3000`
   - Onboarding: `http://localhost:3000/onboarding` (after login)
   - Admin dashboard: `http://localhost:3000/admin/dashboard` (after onboarding)

## User Flow

1. **New User Registration:**
   - User signs up/logs in via Auth0
   - Middleware checks onboarding status
   - Redirects to onboarding wizard if not completed

2. **Onboarding Process:**
   - Step 1: Welcome screen with feature overview
   - Step 2: Company information and description
   - Step 3: Capability statements upload
   - Step 4: Team resumes upload  
   - Step 5: Past proposals upload
   - Step 6: Review and complete

3. **Admin Dashboard:**
   - Dashboard overview with document counts
   - Profile management
   - Document management (upload, view, delete)
   - Content indexing (framework ready)

## API Endpoints

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/complete-onboarding` - Mark onboarding complete

### Document Management
- `GET /api/documents/[type]` - List documents by type
- `POST /api/documents/[type]/upload` - Upload new document
- `GET /api/documents/[type]/[id]/download` - Get download URL
- `DELETE /api/documents/[type]/[id]` - Delete document

### Content Indexing
- `POST /api/indexing/start` - Start indexing job
- `GET /api/indexing/status` - Get current status
- `GET /api/indexing/history` - Get indexing history

## Security Considerations

- All API endpoints require authentication
- User data is isolated by Auth0 user ID
- File uploads use presigned URLs for direct S3 access
- File type validation (PDF, DOC, DOCX only)
- File size limits (25MB per file)
- XSS protection with input sanitization

## Content Indexing Integration

The system is ready for vector database integration:

1. **Text Extraction**: Framework for extracting text from uploaded documents
2. **Embedding Generation**: Ready for AI/ML pipeline integration
3. **Vector Storage**: Prepared for Weaviate or similar vector database
4. **Job Management**: DynamoDB-based job tracking system

## Deployment

For production deployment:

1. Set up AWS infrastructure (DynamoDB, S3, IAM roles)
2. Configure Auth0 for production domain
3. Set up CI/CD pipeline
4. Configure monitoring and logging
5. Set up backup and disaster recovery

## Troubleshooting

### Common Issues

1. **Auth0 Redirect Issues:**
   - Verify callback URLs in Auth0 dashboard
   - Check AUTH0_BASE_URL environment variable

2. **AWS Permission Issues:**
   - Verify IAM permissions for DynamoDB and S3
   - Check region configuration

3. **File Upload Issues:**
   - Verify S3 bucket CORS configuration
   - Check file size and type restrictions

### Debug Tools

- Check browser console for client-side errors
- Review Next.js server logs for API errors
- Use AWS CloudWatch for infrastructure monitoring

## Future Enhancements

The system is designed to support:

- Vector database integration for content similarity
- Advanced document processing (OCR, text extraction)
- Machine learning-based opportunity matching
- Automated content categorization
- Advanced analytics and reporting

## Support

For technical support or questions about the implementation, refer to:
- Next.js documentation: https://nextjs.org/docs
- Auth0 documentation: https://auth0.com/docs
- AWS SDK documentation: https://docs.aws.amazon.com/