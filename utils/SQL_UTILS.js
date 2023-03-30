const logger = require("./logger")

/**
 * @description replaces all occurences of single quote ' with two single quotes ''
 * @param {*} string
 * @returns escaped string unless the string contains multiple sequential single quotes
 */
const escapeSingleQuotes = (str) => {
  const doubleQuote = '\'\''
  if (str.includes(doubleQuote)) {
    logger.warn('double single quotes present. no escaping performed.')
    return str
  }
  return str.replace(/'/g, doubleQuote)
}

/**
 * @description constructs INSERT INTO statement for credential storage
 * @param {*} param0 json object containing username, email and password keys
 * @returns INSERT INTO SQL for public.um_users
 */
const buildInsertUmUsers = ({username, email, password}) => {
  return `INSERT INTO public.um_users (username, email, password) VALUES (
    '${username}',
    '${email}',
    crypt('${password}', gen_salt('bf',12))
  );`
}

/**
 * @description constructs SELECT statement for credential verification
 * @param {*} param0 json object containing username, email and password keys
 * @returns SELECT FROM SQL for public.um_users
 */
 const buildVerifyUsername = ({username, password}) => {
  return `SELECT * FROM public.um_users
  WHERE username = '${username}'
    AND password = crypt('${password}', password);`
}

/**
 * @description constructs SELECT statement for finding a user by id
 * @param {*} param0 the user id to be found
 * @returns SELECT FROM SQL for public.um_users
 */
 const buildFindUserById = (id) => {
  return `SELECT id, username FROM public.um_users
  WHERE id = ${id};`
}

/**
 * @description constructs INSERT INTO statement while sanitizing values of provided json object by e.g.
 * 1) casting all values within json to String for proper escaping via helper method
 * 2) replacing all occurences of single quotes ' with two single quotes ''
 * @param {*} element json encoded single element containing the mandatory keys:
 * description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities
 * @returns INSERT INTO SQL for staging.staging_variable_bills
 */
const buildInsertStagingVariableBills = (element) => {
  let e = element

  // loops through keys of json object and sanitizes inputs
  for (let key in e) {
      if (e.hasOwnProperty(key)) {
        e[key] = escapeSingleQuotes(String(e[key]))
      }
  }
  const insertRow = `INSERT INTO staging.staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
      VALUES (
        '${e.description}',
        INITCAP('${e.category}'),
        INITCAP('${e.store}'),
        ${e.cost},
        TO_DATE('${e.date}','DD.MM.YYYY'),
        '${e.is_planned}',
        '${e.contains_indulgence}',
        LOWER('${e.sensitivities}')
      );
      `
      return insertRow
}
/**
 * @description Debug logging for SQL Queries executed by the backend server
 * @param {*} sql SQL Statement
 * @param {*} parameters Paramaters for SQL Statement
 */
const logSqlStatement = (sql, parameters) => {
  logger.debug(
    `--SQL
    [QUERY]
    ${sql}

    [PARAMTERS]
    ${parameters ? parameters : 'empty'}`
  )
}

module.exports = {
  buildInsertStagingVariableBills,
  buildInsertUmUsers,
  buildVerifyUsername,
  buildFindUserById,
  logSqlStatement
}