#!/bin/bash

# KitaNime Vercel Deployment Script
# This script helps deploy KitaNime to Vercel

set -e

echo "🚀 KitaNime Vercel Deployment Script"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed!"
        echo "Please install it with: npm i -g vercel"
        exit 1
    fi
    print_success "Vercel CLI is installed"
}

# Check if user is logged in to Vercel
check_vercel_auth() {
    if ! vercel whoami &> /dev/null; then
        print_error "Not logged in to Vercel!"
        echo "Please login with: vercel login"
        exit 1
    fi
    print_success "Logged in to Vercel"
}

# Check if git repository is clean
check_git_status() {
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "Git repository has uncommitted changes"
        read -p "Do you want to commit them? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "feat: prepare for Vercel deployment"
            print_success "Changes committed"
        else
            print_error "Please commit or stash your changes before deploying"
            exit 1
        fi
    fi
    print_success "Git repository is clean"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found"
        if [ -f "VERCEL_ENV.txt" ]; then
            print_status "Copying VERCEL_ENV.txt to .env"
            cp VERCEL_ENV.txt .env
            print_warning "Please update .env file with your actual values"
        else
            print_error "No environment file found. Please create .env file"
            exit 1
        fi
    fi
    print_success "Environment file found"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Run tests (if available)
run_tests() {
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        print_status "Running tests..."
        npm test
        print_success "Tests passed"
    else
        print_warning "No tests found, skipping..."
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if project is already linked
    if [ -f ".vercel/project.json" ]; then
        print_status "Project already linked, deploying..."
        vercel --prod
    else
        print_status "Linking project to Vercel..."
        vercel --prod
    fi
    
    print_success "Deployment completed!"
}

# Show deployment info
show_deployment_info() {
    print_status "Getting deployment information..."
    
    # Get project URL
    PROJECT_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "Check Vercel Dashboard")
    
    echo ""
    echo "🎉 Deployment Successful!"
    echo "========================"
    echo "Project URL: https://$PROJECT_URL"
    echo "Dashboard: https://vercel.com/dashboard"
    echo ""
    echo "📊 Next Steps:"
    echo "1. Check your deployment at: https://$PROJECT_URL"
    echo "2. Configure environment variables in Vercel Dashboard"
    echo "3. Set up custom domain (optional)"
    echo "4. Enable Vercel Analytics"
    echo ""
}

# Main deployment function
main() {
    echo "Starting deployment process..."
    echo ""
    
    # Pre-deployment checks
    check_vercel_cli
    check_vercel_auth
    check_git_status
    check_env_file
    
    # Build and test
    install_dependencies
    run_tests
    
    # Deploy
    deploy_to_vercel
    
    # Show results
    show_deployment_info
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --preview      Deploy to preview environment"
        echo "  --prod         Deploy to production (default)"
        echo ""
        echo "Examples:"
        echo "  $0              # Deploy to production"
        echo "  $0 --preview    # Deploy to preview"
        echo ""
        exit 0
        ;;
    --preview)
        print_status "Deploying to preview environment..."
        vercel
        print_success "Preview deployment completed!"
        ;;
    --prod)
        main
        ;;
    *)
        main
        ;;
esac
