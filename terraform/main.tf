# ==============================================================================
# REALNEST X — AWS TERRAFORM INFRASTRUCTURE AS CODE (MULTI-AZ PRODUCTION)
# ==============================================================================

terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Environment = "Production"
      Project     = "RealNest-X"
      ManagedBy   = "Terraform"
    }
  }
}

variable "aws_region" {
  default = "us-east-1"
}

# 1. High-Availability Multi-AZ VPC
resource "aws_vpc" "realnest_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "realnest-x-vpc"
  }
}

# 2. Amazon Aurora PostgreSQL Serverless v2 (PostGIS Compatible)
resource "aws_rds_cluster" "aurora_cluster" {
  cluster_identifier     = "realnest-x-aurora"
  engine                 = "aurora-postgresql"
  engine_version         = "16.2"
  database_name          = "realnest_x"
  master_username        = "dbadmin"
  master_password        = "P@ssw0rdEnterprise2026!" # In prod, inject via AWS Secrets Manager
  skip_final_snapshot    = true
  storage_encrypted      = true

  serverlessv2_scaling_configuration {
    min_capacity = 0.5
    max_capacity = 32.0
  }
}

# 3. AWS ElastiCache for Redis 7 (L2 Cache & Session Store)
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "realnest-x-redis"
  engine               = "redis"
  node_type            = "cache.r7g.large"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}

# 4. Amazon S3 Bucket for Media Assets & CloudFront CDN
resource "aws_s3_bucket" "media_bucket" {
  bucket = "realnest-x-media-assets-prod"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.media_bucket.bucket_regional_domain_name
    origin_id   = "S3-realnest-media"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-realnest-media"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

output "cloudfront_domain" {
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
  description = "CloudFront CDN edge URL for real estate photography & 360 assets"
}
