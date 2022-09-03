import {MigrationInterface, QueryRunner} from "typeorm";

export class addTables1655589963414 implements MigrationInterface {
    name = 'addTables1655589963414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying NOT NULL, "password" character varying NOT NULL, "refreshToken" character varying, "name" character varying NOT NULL, "phone" character varying, "verified" boolean DEFAULT false, "active" boolean NOT NULL DEFAULT true, "role" character varying NOT NULL DEFAULT '{"ADMIN":"ADMIN","CLIENT":"CLIENT"}', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_otp" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "otp" character varying NOT NULL, "otp_type" character varying NOT NULL, "expiration_time" TIMESTAMP WITH TIME ZONE NOT NULL, "sent_to" character varying NOT NULL DEFAULT 'phone', "userId" integer, CONSTRAINT "PK_06c70acc09e7cb64b282d37e139" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "auth_otp" ADD CONSTRAINT "FK_1cf9ff4ed6b3d4c6225d7bff9ae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_otp" DROP CONSTRAINT "FK_1cf9ff4ed6b3d4c6225d7bff9ae"`);
        await queryRunner.query(`DROP TABLE "auth_otp"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
