terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

variable "project_name" {
  description = "Project name used for tagging and resource naming"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for the database security group"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for the DB subnet group"
  type        = list(string)
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to reach MySQL (typically private subnet CIDRs or app SG)"
  type        = list(string)
  default     = []
}

variable "allowed_security_group_ids" {
  description = "Security group IDs allowed to reach MySQL"
  type        = list(string)
  default     = []
}

variable "db_name" {
  description = "Initial database name"
  type        = string
  default     = "admax_india"
}

variable "db_username" {
  description = "Master username"
  type        = string
  default     = "admax"
}

variable "instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t4g.micro"
}

variable "allocated_storage" {
  description = "Allocated storage in GB"
  type        = number
  default     = 20
}

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

resource "random_password" "master" {
  length           = 24
  special          = true
  override_special = "!#$%^&*()-_=+"
}

resource "aws_db_subnet_group" "this" {
  name       = "${local.name_prefix}-mysql"
  subnet_ids = var.private_subnet_ids

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-mysql-subnets"
  })
}

resource "aws_security_group" "mysql" {
  name        = "${local.name_prefix}-mysql"
  description = "MySQL access for ${local.name_prefix}"
  vpc_id      = var.vpc_id

  dynamic "ingress" {
    for_each = length(var.allowed_cidr_blocks) > 0 ? [1] : []
    content {
      description = "MySQL from allowed CIDRs"
      from_port   = 3306
      to_port     = 3306
      protocol    = "tcp"
      cidr_blocks = var.allowed_cidr_blocks
    }
  }

  dynamic "ingress" {
    for_each = toset(var.allowed_security_group_ids)
    content {
      description     = "MySQL from app security group"
      from_port       = 3306
      to_port         = 3306
      protocol        = "tcp"
      security_groups = [ingress.value]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-mysql-sg"
  })
}

resource "aws_db_instance" "mysql" {
  identifier                 = "${local.name_prefix}-mysql"
  engine                     = "mysql"
  engine_version             = "8.4"
  instance_class             = var.instance_class
  allocated_storage          = var.allocated_storage
  db_name                    = var.db_name
  username                   = var.db_username
  password                   = random_password.master.result
  db_subnet_group_name       = aws_db_subnet_group.this.name
  vpc_security_group_ids     = [aws_security_group.mysql.id]
  publicly_accessible        = false
  multi_az                   = var.environment == "prod"
  storage_encrypted          = true
  skip_final_snapshot        = var.environment != "prod"
  deletion_protection        = var.environment == "prod"
  backup_retention_period    = var.environment == "prod" ? 7 : 1
  auto_minor_version_upgrade = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-mysql"
  })
}

output "db_instance_endpoint" {
  description = "RDS endpoint hostname"
  value       = aws_db_instance.mysql.address
}

output "db_instance_port" {
  description = "RDS port"
  value       = aws_db_instance.mysql.port
}

output "db_name" {
  description = "Database name"
  value       = aws_db_instance.mysql.db_name
}

output "db_username" {
  description = "Master username"
  value       = aws_db_instance.mysql.username
}

output "db_password" {
  description = "Generated master password (sensitive)"
  value       = random_password.master.result
  sensitive   = true
}

output "security_group_id" {
  description = "MySQL security group ID"
  value       = aws_security_group.mysql.id
}
