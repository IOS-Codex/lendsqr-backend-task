import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transaction_table', (table) => {
        table.bigIncrements('id').primary();
        table.bigInteger('userId').unsigned().notNullable();
        table.bigInteger('walletId').unsigned().notNullable();
        table.bigInteger('transAmount').notNullable();
        table.enum('transType', ['credit', 'debit', 'reversal']).notNullable();
        table.enum('transStatus', ['pending', 'completed', 'failed']).notNullable();
        table.dateTime('transDate').notNullable();

        // Define foreign key constraints
        table.foreign('userId').references('id').inTable('users_table');
        table.foreign('walletId').references('id').inTable('wallet_table');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transaction_table');
}