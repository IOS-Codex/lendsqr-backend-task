import credentials from './src/config/db_config';

//define the types for the connection
interface ConnectionConfig {
  database: string;
  user: string;
  password: string;
}

interface EnvironmentConfig {
  connectionVariables: {
    client: string;
    connection: ConnectionConfig;
  };
}

//assign values to connect with the database 
const environmentConfig: EnvironmentConfig = {
  connectionVariables: {
    client: 'mysql',
    connection: {
      database: credentials.database,
      user: credentials.user,
      password: credentials.password
    }
  }
};

export default environmentConfig;
