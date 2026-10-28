CREATE TABLE "HomeContent" (
    "id" TEXT NOT NULL DEFAULT 'home',
    "content" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeContent_pkey" PRIMARY KEY ("id")
);
