const postgresRoutes = require ('express').Router()
const { getTestData,

        getAllCategories,
        getAllStores,
        getAllSensisitivies,
        getAllVariableExpenses,
        getAllFixedCosts,
        getAllSensitivitiesOfPurchase,

        getCategoryById,
        getStoreById,
        getSensitivityById,
        getVariableExpenseById,
        getFixedCostById,
        getFixedCostsByEffectiveDate,
        getSensitivitiesOfPurchaseyBySensitivityId,
        getSensitivitiesOfPurchaseyByVarExpenseId} = require('../controllers/read_postgresController')
const { postTestData,
  postVariableExpensesJson,
  postVariableExpensesTextTsv,
  postVariableExpensesCsv,
  postFixedCostsTextTsv,
  createUserCredentials,
  loginWithUserCredentials } = require('../controllers/create_postgresController')
const { authenticateUser } = require('../middleware/authentication.js')
const { updateTestData } = require('../controllers/update_postgresController')
const { deleteTestData } = require('../controllers/delete_postgresController')

//  ___  ___  __  ___
//   |  |__  /__`  |
//   |  |___ .__/  |

postgresRoutes.get('/',authenticateUser, getTestData)
postgresRoutes.post('/',authenticateUser, postTestData)
postgresRoutes.put('/:id',authenticateUser, updateTestData)
postgresRoutes.delete('/:id',authenticateUser, deleteTestData)
//   __   ___       __
//  |__) |__   /\  |  \
//  |  \ |___ /~~\ |__/

// getAll
postgresRoutes.get('/category',authenticateUser, getAllCategories)
postgresRoutes.get('/store',authenticateUser, getAllStores)
postgresRoutes.get('/sensitivity',authenticateUser, getAllSensisitivies)
postgresRoutes.get('/variable_expenses',authenticateUser, getAllVariableExpenses)
postgresRoutes.get('/fixed_costs',authenticateUser, getAllFixedCosts)
postgresRoutes.get('/sensitivities_of_purchase',authenticateUser, getAllSensitivitiesOfPurchase)
// getSpecificData
postgresRoutes.get('/category/:id', getCategoryById)
postgresRoutes.get('/store/:id', getStoreById)
postgresRoutes.get('/sensitivity/:id', getSensitivityById)
postgresRoutes.get('/variable_expenses/:id', getVariableExpenseById)
postgresRoutes.get('/fixed_costs/:id',authenticateUser, getFixedCostById)
postgresRoutes.get('/fixed_costs/valid/:date',authenticateUser, getFixedCostsByEffectiveDate)
postgresRoutes.get('/sensitivities_of_purchase/sensitivity/:id', getSensitivitiesOfPurchaseyBySensitivityId)
postgresRoutes.get('/sensitivities_of_purchase/var_expense/:id', getSensitivitiesOfPurchaseyByVarExpenseId)

//   __   __   ___      ___  ___
//  /  ` |__) |__   /\   |  |__
//  \__, |  \ |___ /~~\  |  |___
postgresRoutes.post('/json/variable_expenses', postVariableExpensesJson)
postgresRoutes.post('/texttsv/variable_expenses', postVariableExpensesTextTsv)
postgresRoutes.post('/csv/variable_expenses', postVariableExpensesCsv)
postgresRoutes.post('/texttsv/fixed_costs', postFixedCostsTextTsv)
postgresRoutes.post('/um/credentials', createUserCredentials)
postgresRoutes.post('/um/login', loginWithUserCredentials)

//        __   __       ___  ___
//  |  | |__) |  \  /\   |  |__
//  \__/ |    |__/ /~~\  |  |___

//   __   ___       ___ ___  ___
//  |  \ |__  |    |__   |  |__
//  |__/ |___ |___ |___  |  |___


module.exports = postgresRoutes