# AdMax India — Infrastructure as Code (Terraform / OpenTofu compatible)

## Assumptions & version floor
- Runtime: Terraform **>= 1.5** (OpenTofu 1.6+ also works with the same HCL)
- Provider: `hashicorp/aws` `~> 5.0`
- Backend: S3 + DynamoDB lock table (created by `bootstrap/`)
- Regions default: `ap-south-1` (Mumbai)
- Criticality: start in **dev**; never apply prod without a reviewed plan artifact

## Layout (Anton Babenko module hierarchy)

```
infra/
├── bootstrap/              # one-time remote state bucket + lock table
├── modules/
│   ├── networking/         # VPC, subnets, NAT (resource module)
│   ├── database/           # RDS MySQL (resource module)
│   ├── ecr/                # container registries (resource module)
│   └── eks/                # EKS cluster + node group (resource module)
├── environments/
│   ├── dev/                # composition for development
│   └── prod/               # composition for production (separate state key)
└── .tflint.hcl
```

## Bootstrap (once per AWS account)

```bash
cd infra/bootstrap
terraform init
terraform plan -out=bootstrap.tfplan
terraform apply bootstrap.tfplan
```

Copy the printed backend snippet into `environments/dev/backend.hcl`.

## Dev environment

```bash
cd infra/environments/dev
cp backend.hcl.example backend.hcl   # edit bucket/table
cp terraform.tfvars.example terraform.tfvars
terraform init -backend-config=backend.hcl
terraform fmt -recursive ../..
terraform validate
terraform plan -out=tfplan
# Review tfplan, then:
terraform apply tfplan
```

## Validation plan
- `terraform fmt -check -recursive`
- `terraform validate`
- `tflint --init && tflint --recursive` (from `infra/`)
- `terraform test` inside `modules/networking` (plan-only fixture)
- Never `terraform apply` prod without PR plan review + environment approval

## Rollback notes
- Prefer `terraform plan` + targeted fixes over destroy
- If you must remove infra: `terraform plan -destroy` first and review every resource
- Keep plan artifacts (`tfplan`) for audit evidence

## Wire to Kubernetes
1. `aws eks update-kubeconfig --name <cluster>`
2. Build/push images to ECR URLs from outputs
3. Update `k8s/` image refs and DB host to RDS endpoint
4. `kubectl apply -k k8s/`
