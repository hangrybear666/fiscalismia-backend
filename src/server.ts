import { app, config } from './app';
const logger = require('./utils/logger');

app.listen(config.PORT, () =>
  logger.http(`${process.env.NODE_ENV !== 'production' ? 'Docker ' : 'Cloud Hosted '}Postgres DB running ${process.env.NODE_ENV !== 'production' ? `on ${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}` : 'in [neon.tech cloud]'}
Server is listening at address: \r\n${config.SERVER_ADDRESS} `)
);
// app.listen(config.PORT,ip.address(), () => console.log(`Server is running on address \r\n${ip.address()}:${config.PORT}${config.API_ADDRESS}`)) // TODO change ip after production deployment
