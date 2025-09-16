-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "favorites" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
