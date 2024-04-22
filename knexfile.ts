import credentials from './src/config/db_config';



// Define the types for the environment configuration
interface EnvironmentConfig {
  client: string;
  connection: string;
  migrations: {
    tableName: string;
    directory: string;
  };
}

// Assign values to connect with the database 
const environmentConfig: EnvironmentConfig = {
  client: 'mysql',
  connection: credentials.connectionString,
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  }
};

export default environmentConfig;
