# Local / demo Kubernetes for AdMax India
#
# 1. Copy secret.example.yaml → secret.yaml and fill values (keep secret.yaml out of git)
# 2. Update image names in kustomization.yaml / Deployments
# 3. Apply:
#      kubectl apply -k k8s/
# 4. Watch:
#      kubectl -n admax-india get pods,svc,ingress,hpa
#
# Production: use RDS + ECR/EKS from infra/ instead of in-cluster MySQL.
