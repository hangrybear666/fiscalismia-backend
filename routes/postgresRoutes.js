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
        getSensitivitiesOfPurchaseyByVarExpenseId} = require('../controllers/postgresController')

postgresRoutes.get('/', getTestData)
// getAllData
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

module.exports = postgresRoutes