import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Roles
  const candidate = await prisma.role.upsert({
    where: { name: "candidate" },
    update: {},
    create: { name: "candidate" },
  });

  const employer = await prisma.role.upsert({
    where: { name: "employer" },
    update: {},
    create: { name: "employer" },
  });

  const admin = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  // Create Permissions
  const permissions = [
    {
      action: "job:create",
      api: "POST /jobs",
      description: "Create job postings",
    },
    {
      action: "job:update",
      api: "PUT /jobs/:id",
      description: "Update job postings",
    },
    {
      action: "job:delete",
      api: "DELETE /jobs/:id",
      description: "Delete job postings",
    },
    {
      action: "application:create",
      api: "POST /applications",
      description: "Apply to a job",
    },
    {
      action: "application:update",
      api: "PATCH /applications/:id",
      description: "Update application status",
    },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { action: p.action },
      update: {},
      create: p,
    });
  }

  // Attach permissions to roles
  const allPermissions = await prisma.permission.findMany();

  // Employer gets job management
  const employerPerms = allPermissions.filter((p) =>
    ["job:create", "job:update", "job:delete"].includes(p.action)
  );

  for (const p of employerPerms) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: { role_id: employer.id, permission_id: p.id },
      },
      update: {},
      create: { role_id: employer.id, permission_id: p.id },
    });
  }

  // Candidate gets application
  const candidatePerms = allPermissions.filter((p) =>
    ["application:create"].includes(p.action)
  );

  for (const p of candidatePerms) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: { role_id: candidate.id, permission_id: p.id },
      },
      update: {},
      create: { role_id: candidate.id, permission_id: p.id },
    });
  }

  // Admin gets everything
  for (const p of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: { role_id: admin.id, permission_id: p.id },
      },
      update: {},
      create: { role_id: admin.id, permission_id: p.id },
    });
  }

  console.log("✅ RBAC seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
