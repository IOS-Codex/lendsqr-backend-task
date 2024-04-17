import credentials from './src/config/db_config';

// Define the types for the connection
interface ConnectionConfig {
  database: string;
  user: string;
  password: string;
}

// Define the types for the environment configuration
interface EnvironmentConfig {
  client: string;
  connection: ConnectionConfig;
  migrations: {
    tableName: string;
    directory: string;
  };
}

// Assign values to connect with the database 
const environmentConfig: EnvironmentConfig = {
  client: 'mysql',
  connection: {
    database: credentials.database,
    user: credentials.user,
    password: credentials.password
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  }
};

export default environmentConfig;
