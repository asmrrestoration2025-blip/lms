import { describe, it, expect } from "vitest";
import { ROLES, PERMISSIONS } from "@/lib/permissions/constants";

describe("permissions constants", () => {
  it("has 4 roles", () => {
    expect(Object.values(ROLES)).toEqual(["student", "instructor", "admin", "superadmin"]);
  });
  it("defines admins.create", () => {
    expect(PERMISSIONS.ADMINS_CREATE).toBe("admins.create");
  });
});
