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
const { postTestData } = require('../controllers/create_postgresController')
const { updateTestData } = require('../controllers/update_postgresController')
const { deleteTestData } = require('../controllers/delete_postgresController')

//  ___  ___  __  ___
//   |  |__  /__`  |
//   |  |___ .__/  |

postgresRoutes.get('/', getTestData)
postgresRoutes.post('/', postTestData)
postgresRoutes.put('/:id', updateTestData)
postgresRoutes.delete('/:id', deleteTestData)
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

//        __   __       ___  ___
//  |  | |__) |  \  /\   |  |__
//  \__/ |    |__/ /~~\  |  |___

//   __   ___       ___ ___  ___
//  |  \ |__  |    |__   |  |__
//  |__/ |___ |___ |___  |  |___


module.exports = postgresRoutes