import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758459232755 implements MigrationInterface {
    name = 'InitialMigration1758459232755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."download_logs_status_enum" AS ENUM('initiated', 'success', 'failed', 'unauthorized', 'expired')`);
        await queryRunner.query(`CREATE TABLE "download_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "statementId" uuid NOT NULL, "ipAddress" character varying NOT NULL, "userAgent" character varying, "status" "public"."download_logs_status_enum" NOT NULL, "downloadToken" character varying, "tokenExpiresAt" TIMESTAMP, "errorMessage" character varying, "downloadCompletedAt" TIMESTAMP, CONSTRAINT "PK_3f54c9c0ce0d52b97d2326c85e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."statements_status_enum" AS ENUM('uploaded', 'processing', 'available', 'expired', 'archived')`);
        await queryRunner.query(`CREATE TABLE "statements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "fileName" character varying NOT NULL, "originalFileName" character varying NOT NULL, "fileSizeBytes" integer NOT NULL, "mimeType" character varying NOT NULL DEFAULT 'application/pdf', "storagePath" character varying NOT NULL, "statementDate" date NOT NULL, "statementPeriod" character varying(7) NOT NULL, "status" "public"."statements_status_enum" NOT NULL DEFAULT 'uploaded', "expiresAt" TIMESTAMP, "downloadCount" integer NOT NULL DEFAULT '0', "uploadedBy" character varying, "customerId" uuid NOT NULL, CONSTRAINT "PK_7f53bcddeb706df7ea7eec10b8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "customerNumber" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_ac2fd5d477df162f3f6246c7284" UNIQUE ("customerNumber"), CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "download_logs" ADD CONSTRAINT "FK_8e79e4d9f120bc20bce420b26e3" FOREIGN KEY ("statementId") REFERENCES "statements"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statements" ADD CONSTRAINT "FK_067f625fd1ff9a6b4b371a86f36" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statements" DROP CONSTRAINT "FK_067f625fd1ff9a6b4b371a86f36"`);
        await queryRunner.query(`ALTER TABLE "download_logs" DROP CONSTRAINT "FK_8e79e4d9f120bc20bce420b26e3"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "statements"`);
        await queryRunner.query(`DROP TYPE "public"."statements_status_enum"`);
        await queryRunner.query(`DROP TABLE "download_logs"`);
        await queryRunner.query(`DROP TYPE "public"."download_logs_status_enum"`);
    }

}
