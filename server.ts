import { app, config } from './app';

// run on localhost
app.listen(config.PORT, () =>
  console.log(`Postgres DB running ${process.env.DB_CONNECTION_URL ? 'in [neon.tech cloud]' : 'on [localhost]'}
Server is listening at address: \r\n${config.SERVER_ADDRESS} `)
);
// app.listen(config.PORT,ip.address(), () => console.log(`Server is running on address \r\n${ip.address()}:${config.PORT}${config.API_ADDRESS}`)) // TODO change ip after production deployment
