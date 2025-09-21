import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758477027255 implements MigrationInterface {
    name = 'InitialMigration1758477027255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "download_logs_status_enum" AS ENUM('initiated', 'success', 'failed', 'unauthorized', 'expired')`);
        await queryRunner.query(`CREATE TABLE "download_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "statementId" uuid NOT NULL, "userId" character varying NOT NULL, "ipAddress" character varying NOT NULL, "userAgent" character varying, "status" "download_logs_status_enum" NOT NULL, "downloadToken" character varying, "tokenExpiresAt" TIMESTAMP, "errorMessage" character varying, "downloadCompletedAt" TIMESTAMP, CONSTRAINT "PK_3f54c9c0ce0d52b97d2326c85e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "statements_status_enum" AS ENUM('uploaded', 'processing', 'available', 'expired', 'archived')`);
        await queryRunner.query(`CREATE TABLE "statements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "fileName" character varying NOT NULL, "originalFileName" character varying NOT NULL, "fileSizeBytes" integer NOT NULL, "mimeType" character varying NOT NULL DEFAULT 'application/pdf', "storagePath" character varying NOT NULL, "statementDate" date NOT NULL, "statementPeriod" character varying(7) NOT NULL, "status" "statements_status_enum" NOT NULL DEFAULT 'uploaded', "expiresAt" TIMESTAMP, "downloadCount" integer NOT NULL DEFAULT '0', "uploadedBy" character varying, "userId" character varying NOT NULL, CONSTRAINT "PK_7f53bcddeb706df7ea7eec10b8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "download_logs" ADD CONSTRAINT "FK_8e79e4d9f120bc20bce420b26e3" FOREIGN KEY ("statementId") REFERENCES "statements"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "download_logs" DROP CONSTRAINT "FK_8e79e4d9f120bc20bce420b26e3"`);
        await queryRunner.query(`DROP TABLE "statements"`);
        await queryRunner.query(`DROP TYPE "statements_status_enum"`);
        await queryRunner.query(`DROP TABLE "download_logs"`);
        await queryRunner.query(`DROP TYPE "download_logs_status_enum"`);
    }

}
