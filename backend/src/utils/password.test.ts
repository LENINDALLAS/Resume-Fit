import { describe, expect, it } from "vitest";
import { comparePassword, hashPassword } from "./password.js";

describe("password utils", () => {
  it("never stores the plaintext password in the hash", async () => {
    const hash = await hashPassword("Sup3rSecret!");
    expect(hash).not.toBe("Sup3rSecret!");
  });

  it("accepts the correct password", async () => {
    const hash = await hashPassword("Sup3rSecret!");
    await expect(comparePassword("Sup3rSecret!", hash)).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("Sup3rSecret!");
    await expect(comparePassword("WrongPassword!", hash)).resolves.toBe(false);
  });
});
