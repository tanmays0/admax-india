variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "admax-india"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "vpc_cidr_block" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.20.0.0/16"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t4g.micro"
}

variable "eks_node_desired_size" {
  description = "Desired EKS node count"
  type        = number
  default     = 2
}

variable "eks_node_min_size" {
  description = "Minimum EKS node count"
  type        = number
  default     = 2
}

variable "eks_node_max_size" {
  description = "Maximum EKS node count"
  type        = number
  default     = 4
}
