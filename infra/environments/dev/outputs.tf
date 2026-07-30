output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "ecr_repository_urls" {
  description = "ECR repository URLs for api/web images"
  value       = module.ecr.repository_urls
}

output "eks_cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "EKS API endpoint"
  value       = module.eks.cluster_endpoint
}

output "rds_endpoint" {
  description = "RDS MySQL endpoint"
  value       = module.database.db_instance_endpoint
}

output "rds_password" {
  description = "RDS master password (sensitive)"
  value       = module.database.db_password
  sensitive   = true
}

output "kubeconfig_command" {
  description = "Command to update kubeconfig for this cluster"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}
