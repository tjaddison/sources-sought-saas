#!/bin/bash

# Build script for load_sam_opps Lambda function
# Target: x86_64 architecture, Python 3.12

set -e

# Variables
FUNCTION_NAME="load_sam_opps"
BUILD_DIR="./build"
PACKAGE_DIR="$BUILD_DIR/package"
PYTHON_VERSION="3.12"
ARCHITECTURE="x86_64"

echo "Building $FUNCTION_NAME for $ARCHITECTURE and Python $PYTHON_VERSION..."

# Clean previous build
echo "Cleaning previous build..."
rm -rf $BUILD_DIR
mkdir -p $PACKAGE_DIR

# Copy Lambda function
echo "Copying Lambda function..."
cp lambda_function.py $PACKAGE_DIR/

# Install dependencies for the target platform
echo "Installing dependencies for Lambda runtime..."
pip install \
    --platform manylinux2014_x86_64 \
    --target $PACKAGE_DIR \
    --implementation cp \
    --python-version $PYTHON_VERSION \
    --only-binary=:all: \
    --upgrade \
    -r package/requirements.txt

# Create deployment package
echo "Creating deployment package..."
cd $PACKAGE_DIR
zip -r ../deployment.zip .
cd ../..

echo "Build complete! Deployment package: $BUILD_DIR/deployment.zip"
echo "Package size: $(du -h $BUILD_DIR/deployment.zip | cut -f1)"