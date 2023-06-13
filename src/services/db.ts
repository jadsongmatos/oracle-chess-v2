import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const client =
  globalThis.prisma ||
  new PrismaClient({
    log: [
      {
        emit: "stdout",
        level: "error",
      },
    ],
  });

client.$on("beforeExit", (e: any) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});

if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;