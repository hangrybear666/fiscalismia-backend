const postgresRoutes = require('express').Router();
const {
  getTestData,

  getUserSpecificSettings,

  getAllCategories,
  getAllStores,
  getAllSensisitivies,
  getAllVariableExpenses,
  getAllFixedCosts,
  getAllInvestments,
  getAllDividends,
  getAllFixedIncome,
  getAllFoodPricesAndDiscounts,
  getCurrentlyDiscountedFoodPriceInformation,
  getAllSensitivitiesOfPurchase,

  getCategoryById,
  getStoreById,
  getSensitivityById,
  getVariableExpenseById,
  getVariableExpenseByCategory,
  getFixedCostById,
  getFixedCostsByEffectiveDate,
  getFixedIncomeByEffectiveDate,
  getSensitivitiesOfPurchaseyBySensitivityId,
  getSensitivitiesOfPurchaseyByVarExpenseId
} = require('../controllers/read_postgresController');
const {
  postTestData,
  postFoodItemDiscount,
  postNewFoodItem,
  postNewFoodItemsTextTsv,

  postInvestmentAndTaxes,
  postDividendsAndTaxes,
  postInvestmentsTextTsv,

  postVariableExpensesTextTsv,
  postFixedCostsTextTsv,
  postIncomeTextTsv,

  createUserCredentials,
  loginWithUserCredentials,
  postUpdatedUserSettings
} = require('../controllers/create_postgresController');
const { updateTestData, updateFoodItemPrice } = require('../controllers/update_postgresController');
const { deleteTestData, deleteFoodItem } = require('../controllers/delete_postgresController');
const { authenticateUser } = require('../middleware/authentication.js');

//  ___  ___  __  ___
//   |  |__  /__`  |
//   |  |___ .__/  |

postgresRoutes.get('/', authenticateUser, getTestData);
postgresRoutes.post('/', authenticateUser, postTestData);
postgresRoutes.put('/:id', authenticateUser, updateTestData);
postgresRoutes.delete('/:id', authenticateUser, deleteTestData);
//   __   ___       __
//  |__) |__   /\  |  \
//  |  \ |___ /~~\ |__/

// getAll
postgresRoutes.get('/category', authenticateUser, getAllCategories);
postgresRoutes.get('/store', authenticateUser, getAllStores);
postgresRoutes.get('/sensitivity', authenticateUser, getAllSensisitivies);
postgresRoutes.get('/variable_expenses', authenticateUser, getAllVariableExpenses);
postgresRoutes.get('/investments', authenticateUser, getAllInvestments);
postgresRoutes.get('/investment_dividends', authenticateUser, getAllDividends);
postgresRoutes.get('/fixed_costs', authenticateUser, getAllFixedCosts);
postgresRoutes.get('/fixed_income', authenticateUser, getAllFixedIncome);
postgresRoutes.get('/food_prices_and_discounts', authenticateUser, getAllFoodPricesAndDiscounts);
postgresRoutes.get('/discounted_foods_current', authenticateUser, getCurrentlyDiscountedFoodPriceInformation);
postgresRoutes.get('/sensitivities_of_purchase', authenticateUser, getAllSensitivitiesOfPurchase);
// getSpecificData
postgresRoutes.get('/um/settings/:username', authenticateUser, getUserSpecificSettings);
postgresRoutes.get('/category/:id', authenticateUser, getCategoryById);
postgresRoutes.get('/store/:id', authenticateUser, getStoreById);
postgresRoutes.get('/sensitivity/:id', authenticateUser, getSensitivityById);
postgresRoutes.get('/variable_expenses/:id', authenticateUser, getVariableExpenseById);
postgresRoutes.get('/variable_expenses/category/:category', authenticateUser, getVariableExpenseByCategory);
postgresRoutes.get('/fixed_costs/:id', authenticateUser, getFixedCostById);
postgresRoutes.get('/fixed_costs/valid/:date', authenticateUser, getFixedCostsByEffectiveDate);
postgresRoutes.get('/fixed_income/valid/:date', authenticateUser, getFixedIncomeByEffectiveDate);
postgresRoutes.get(
  '/sensitivities_of_purchase/sensitivity/:id',
  authenticateUser,
  getSensitivitiesOfPurchaseyBySensitivityId
);
postgresRoutes.get(
  '/sensitivities_of_purchase/var_expense/:id',
  authenticateUser,
  getSensitivitiesOfPurchaseyByVarExpenseId
);

//   __   __   ___      ___  ___
//  /  ` |__) |__   /\   |  |__
//  \__, |  \ |___ /~~\  |  |___
postgresRoutes.post('/texttsv/variable_expenses', postVariableExpensesTextTsv);
postgresRoutes.post('/texttsv/fixed_costs', postFixedCostsTextTsv);
postgresRoutes.post('/texttsv/fixed_income', postIncomeTextTsv);
postgresRoutes.post('/texttsv/new_food_items', postNewFoodItemsTextTsv);
postgresRoutes.post('/texttsv/investments', postInvestmentsTextTsv);

postgresRoutes.post('/um/credentials', createUserCredentials);
postgresRoutes.post('/um/login', loginWithUserCredentials);
postgresRoutes.post('/um/settings', authenticateUser, postUpdatedUserSettings);

postgresRoutes.post('/food_item_discount', authenticateUser, postFoodItemDiscount);
postgresRoutes.post('/food_item', authenticateUser, postNewFoodItem);
postgresRoutes.post('/investments', authenticateUser, postInvestmentAndTaxes);
postgresRoutes.post('/investment_dividends', authenticateUser, postDividendsAndTaxes);

//        __   __       ___  ___
//  |  | |__) |  \  /\   |  |__
//  \__/ |    |__/ /~~\  |  |___

postgresRoutes.put('/food_item/price/:id', authenticateUser, updateFoodItemPrice);
//   __   ___       ___ ___  ___
//  |  \ |__  |    |__   |  |__
//  |__/ |___ |___ |___  |  |___

postgresRoutes.delete('/food_item/:id', authenticateUser, deleteFoodItem);

module.exports = postgresRoutes;
