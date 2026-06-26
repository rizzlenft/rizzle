import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

describe("tsconfig.json", () => {
  const tsconfigPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../../tsconfig.json",
  );
  const tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf8")) as {
    compilerOptions?: {
      baseUrl?: string;
      paths?: Record<string, string[]>;
      noImplicitAny?: boolean;
      strictNullChecks?: boolean;
    };
  };

  it("sets baseUrl when paths defines @/*", () => {
    expect(tsconfig.compilerOptions?.paths?.["@/*"]).toBeDefined();
    expect(tsconfig.compilerOptions?.baseUrl).toBe(".");
  });

  it("enables noImplicitAny and strictNullChecks", () => {
    expect(tsconfig.compilerOptions?.noImplicitAny).toBe(true);
    expect(tsconfig.compilerOptions?.strictNullChecks).toBe(true);
  });
});

describe("tsconfig.app.json", () => {
  const tsconfigPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../../tsconfig.app.json",
  );
  const tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf8")) as {
    compilerOptions?: {
      noImplicitAny?: boolean;
      strictNullChecks?: boolean;
    };
  };

  it("enables noImplicitAny and strictNullChecks for application source", () => {
    expect(tsconfig.compilerOptions?.noImplicitAny).toBe(true);
    expect(tsconfig.compilerOptions?.strictNullChecks).toBe(true);
  });
});
