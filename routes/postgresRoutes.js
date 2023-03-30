const postgresRoutes = require ('express').Router()
const { getTestData,

        getAllCategories,
        getAllStores,
        getAllSensisitivies,
        getAllVariableExpenses,
        getAllSensitivitiesOfPurchase,

        getCategoryById,
        getStoreById,
        getSensisityById,
        getVariableExpenseById,
        getSensitivitiesOfPurchaseyBySensitivityId,
        getSensitivitiesOfPurchaseyByVarExpenseId} = require('../controllers/read_postgresController')
const { postTestData,
  postVariableExpensesJson,
  postVariableExpensesTextTsv,
  postVariableExpensesCsv,
  createUserCredentials,
  loginWithUserCredentials } = require('../controllers/create_postgresController')
const { authenticateUser } = require('../middleware/authentication.js')
const { updateTestData } = require('../controllers/update_postgresController')
const { deleteTestData } = require('../controllers/delete_postgresController')

//  ___  ___  __  ___
//   |  |__  /__`  |
//   |  |___ .__/  |

postgresRoutes.get('/', authenticateUser, getTestData)
postgresRoutes.post('/',authenticateUser, postTestData)
postgresRoutes.put('/:id',authenticateUser, updateTestData)
postgresRoutes.delete('/:id',authenticateUser, deleteTestData)
//   __   ___       __
//  |__) |__   /\  |  \
//  |  \ |___ /~~\ |__/

// getAll
postgresRoutes.get('/category', getAllCategories)
postgresRoutes.get('/store', getAllStores)
postgresRoutes.get('/sensitivity', getAllSensisitivies)
postgresRoutes.get('/variable_expenses', getAllVariableExpenses)
postgresRoutes.get('/sensitivities_of_purchase', getAllSensitivitiesOfPurchase)
// getSpecificData
postgresRoutes.get('/category/:id', getCategoryById)
postgresRoutes.get('/store/:id', getStoreById)
postgresRoutes.get('/sensitivity/:id', getSensisityById)
postgresRoutes.get('/variable_expenses/:id', getVariableExpenseById)
postgresRoutes.get('/sensitivities_of_purchase/sensitivity/:id', getSensitivitiesOfPurchaseyBySensitivityId)
postgresRoutes.get('/sensitivities_of_purchase/var_expense/:id', getSensitivitiesOfPurchaseyByVarExpenseId)

//   __   __   ___      ___  ___
//  /  ` |__) |__   /\   |  |__
//  \__, |  \ |___ /~~\  |  |___
postgresRoutes.post('/json/variable_expenses', postVariableExpensesJson)
postgresRoutes.post('/texttsv/variable_expenses', postVariableExpensesTextTsv)
postgresRoutes.post('/csv/variable_expenses', postVariableExpensesCsv)
postgresRoutes.post('/um/credentials', createUserCredentials)
postgresRoutes.post('/um/login', loginWithUserCredentials)

//        __   __       ___  ___
//  |  | |__) |  \  /\   |  |__
//  \__/ |    |__/ /~~\  |  |___

//   __   ___       ___ ___  ___
//  |  \ |__  |    |__   |  |__
//  |__/ |___ |___ |___  |  |___


module.exports = postgresRoutes