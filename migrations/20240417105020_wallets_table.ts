import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('wallet_table', (table) => {
        table.bigIncrements('id').unsigned().primary();
        table.bigInteger('addressId').notNullable().unique();
        table.bigInteger('userId').unsigned().notNullable();
        table.bigInteger('balance');
        table.bigInteger('walletPin');

        // Define foreign key constraint
        table.foreign('userId').references('id').inTable('users_table');
    });
}



export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('wallet_table');
}
