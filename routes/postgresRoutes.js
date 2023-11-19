const postgresRoutes = require ('express').Router()
const { getTestData,

        getUserSpecificSettings,

        getAllCategories,
        getAllStores,
        getAllSensisitivies,
        getAllVariableExpenses,
        getAllFixedCosts,
        getAllFoodPricesAndDiscounts,
        getCurrentlyDiscountedFoodPriceInformation,
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
  postFoodItemDiscount,
  postNewFoodItem,
  postNewFoodItemsTextTsv,

  postVariableExpensesJson,
  postVariableExpensesTextTsv,
  postVariableExpensesCsv,
  postFixedCostsTextTsv,
  createUserCredentials,
  loginWithUserCredentials } = require('../controllers/create_postgresController')
const { updateTestData } = require('../controllers/update_postgresController')
const { deleteTestData } = require('../controllers/delete_postgresController')
const { authenticateUser } = require('../middleware/authentication.js')

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
postgresRoutes.get('/food_prices_and_discounts',authenticateUser, getAllFoodPricesAndDiscounts)
postgresRoutes.get('/discounted_foods_current',authenticateUser, getCurrentlyDiscountedFoodPriceInformation)
postgresRoutes.get('/sensitivities_of_purchase',authenticateUser, getAllSensitivitiesOfPurchase)
// getSpecificData
postgresRoutes.get('/um/settings/:username',authenticateUser, getUserSpecificSettings)
postgresRoutes.get('/category/:id',authenticateUser, getCategoryById)
postgresRoutes.get('/store/:id',authenticateUser, getStoreById)
postgresRoutes.get('/sensitivity/:id',authenticateUser, getSensitivityById)
postgresRoutes.get('/variable_expenses/:id',authenticateUser, getVariableExpenseById)
postgresRoutes.get('/fixed_costs/:id',authenticateUser, getFixedCostById)
postgresRoutes.get('/fixed_costs/valid/:date',authenticateUser, getFixedCostsByEffectiveDate)
postgresRoutes.get('/sensitivities_of_purchase/sensitivity/:id',authenticateUser, getSensitivitiesOfPurchaseyBySensitivityId)
postgresRoutes.get('/sensitivities_of_purchase/var_expense/:id',authenticateUser, getSensitivitiesOfPurchaseyByVarExpenseId)

//   __   __   ___      ___  ___
//  /  ` |__) |__   /\   |  |__
//  \__, |  \ |___ /~~\  |  |___
postgresRoutes.post('/json/variable_expenses', postVariableExpensesJson)
postgresRoutes.post('/texttsv/variable_expenses', postVariableExpensesTextTsv)
postgresRoutes.post('/csv/variable_expenses', postVariableExpensesCsv)
postgresRoutes.post('/texttsv/fixed_costs', postFixedCostsTextTsv)
postgresRoutes.post('/texttsv/new_food_items', postNewFoodItemsTextTsv)
postgresRoutes.post('/um/credentials', createUserCredentials)
postgresRoutes.post('/um/login', loginWithUserCredentials)

postgresRoutes.post('/upload/food_item_discount', authenticateUser, postFoodItemDiscount)
postgresRoutes.post('/upload/food_item', authenticateUser, postNewFoodItem)

//        __   __       ___  ___
//  |  | |__) |  \  /\   |  |__
//  \__/ |    |__/ /~~\  |  |___

//   __   ___       ___ ___  ___
//  |  \ |__  |    |__   |  |__
//  |__/ |___ |___ |___  |  |___


module.exports = postgresRoutes