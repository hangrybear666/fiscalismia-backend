const logger = require("./logger")

/**
 * replaces all occurences of single quote ' with two single quotes ''
 * @param {*} string
 * @returns escaped string unless the string contains multiple sequential single quotes
 */
const escapeSingleQuotes = (string) => {
  if (string.includes("''")) {
    logger.warn('double single quotes present. no escaping performed.')
    return string
  }
  return string.replace(/'/g, "''")
}

/**
 * constructs INSERT INTO statement while sanitizing values of provided json object by e.g.
 * 1) replacing all occurences of single quotes ' with two single quotes ''
 * 2) TODO
 * @param {*} element json encoded single element containing the mandatory keys:
 * description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities
 * @returns
 */
const buildInsertIntoStagingVariableBills = (element) => {
  let e = element

  // loops through keys of json object and sanitizes inputs
  for (let key in e) {
      if (e.hasOwnProperty(key)) {
        e[key] = escapeSingleQuotes(e[key])
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

module.exports = {
  escapeSingleQuotes,
  buildInsertIntoStagingVariableBills
}