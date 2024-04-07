/**
 * user object containing userId, userName and userEmail extracted from the db.
 * @table public.um_users
 */
export type User = {
  userId: number;
  userName: string;
  userEmail: string;
};

/**
 * User Credentials Object used for e.g. Account Creation and INSERT into table public.um_users.
 * @table public.um_users
 */
export type UserCredentials = {
  username: string;
  email: string;
  password: string;
};

/**
 * Object received via POST request from Frontend for subsequent DB INSERTION for variable epenses ETL.
 * @table staging.staging_variable_bills
 */
export type StagingVariableBills = {
  description: string;
  category: string;
  store: string;
  cost: number;
  purchasing_date: string;
  is_planned: string;
  contains_indulgence: string;
  sensitivities: string;
  /**
   * Index signature to access this object via it's key name in e.g. a for in loop.
   * to access element: use e[keyname] where keyname is derived eg by Object.keys
   */
  [key: string]: string | number;
};

/**
 * Object received via POST request from Frontend for subsequent DB INSERTION for monthly Fixed Costs.
 * @table public.fixed_costs
 */
export type FixedCosts = {
  category: string;
  description: string;
  monthly_interval: number;
  billed_cost: number;
  monthly_cost: number;
  effective_date: string;
  expiration_date: string;
  /**
   * Index signature to access this object via it's key name in e.g. a for in loop.
   * to access element: use e[keyname] where keyname is derived eg by Object.keys
   */
  [key: string]: string | number;
};

/**
 * Object received via POST request from Frontend for subsequent DB INSERTION for monthly Fixed Income.
 * @table public.fixed_income
 */
export type FixedIncome = {
  description: string;
  type: string;
  monthly_interval: number;
  value: number;
  effective_date: string;
  expiration_date: string;
  /**
   * Index signature to access this object via it's key name in e.g. a for in loop.
   * to access element: use e[keyname] where keyname is derived eg by Object.keys
   */
  [key: string]: string | number;
};

/**
 * Object received via POST request from Frontend for subsequent DB INSERTION for Investments.
 * @table public.investment, public.investment_taxes
 */
export type Investments = {
  execution_type: string;
  description: string;
  isin: string;
  investment_type: string;
  marketplace: string;
  units: number;
  price_per_unit: number;
  total_price: number;
  fees: number;
  execution_date: string;
  pct_of_profit_taxed: number;
  profit_amt: number;
  /**
   * Index signature to access this object via it's key name in e.g. a for in loop.
   * to access element: use e[keyname] where keyname is derived eg by Object.keys
   */
  [key: string]: string | number;
};

/**
 * Object received via POST request from Frontend for subsequent DB INSERTION for New Food Items.
 * @table public.table_food_prices
 */
export type FoodItems = {
  food_item: string;
  brand: string;
  store: string;
  main_macro: string;
  kcal_amount: number;
  weight: number;
  price: number;
  last_update: string;
  /**
   * Index signature to access this object via it's key name in e.g. a for in loop.
   * to access element: use e[keyname] where keyname is derived eg by Object.keys
   */
  [key: string]: string | number;
};
