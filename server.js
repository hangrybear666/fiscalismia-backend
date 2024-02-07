
const config = require('./utils/config')
const app = require("./app");

// run on localhost
app.listen(config.PORT, () => console.log(`Server is running on address \r\n${config.SERVER_ADDRESS}`))
// app.listen(config.PORT,ip.address(), () => console.log(`Server is running on address \r\n${ip.address()}:${config.PORT}${config.API_ADDRESS}`)) // TODO change ip after production deployment