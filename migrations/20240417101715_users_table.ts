import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users_table', (table) => {
        table.bigIncrements('id').unsigned().primary();
        table.text('fullName').notNullable();
        table.text('email').notNullable().unique();
        table.text('mobileNumber').notNullable();
        table.text('password').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users_table');
}
