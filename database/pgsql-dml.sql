/*            __   ___  __  ___          __   ___  __           __   __
 *    | |\ | /__` |__  |__)  |     |  | /__` |__  |__)    |    /  \ / _` | |\ |
 *    | | \| .__/ |___ |  \  |     \__/ .__/ |___ |  \    |___ \__/ \__> | | \|
 */
\c fiscalismia
SET client_encoding TO 'UTF8';
INSERT INTO public.username_whitelist VALUES ('admin');
INSERT INTO public.username_whitelist VALUES ('hangrybear');

INSERT INTO public.um_users (username, email, password) VALUES
('admin',
 'herp_derp@hotmail.com',
  crypt( 'changeit', gen_salt('bf',12)));

INSERT INTO public.um_user_settings(
user_id, setting_key, setting_value, setting_description)
VALUES (
    (SELECT id FROM public.um_users WHERE username = 'admin'),
    'selected_mode',
    'light',
    null);

INSERT INTO public.um_user_settings(
user_id, setting_key, setting_value, setting_description)
VALUES (
    (SELECT id FROM public.um_users WHERE username = 'admin'),
    'selected_palette',
    'default',
    null);
INSERT INTO public.um_user_settings(
user_id, setting_key, setting_value, setting_description)
VALUES (
    (SELECT id FROM public.um_users WHERE username = 'admin'),
    'selected_language',
    'de_DE',
    null);

/*     _____  _____ _____     _____ _   _  _____ ___________ _____ _____    ____________ ________  ___    _____  _____ _   _______  _____  _____    ______  ___ _____ ___
 *    |  __ \|  ___|_   _|   |_   _| \ | |/  ___|  ___| ___ \_   _/  ___|   |  ___| ___ \  _  |  \/  |   /  ___||  _  | | | | ___ \/  __ \|  ___|   |  _  \/ _ \_   _/ _ \
 *    | |  \/| |__   | |       | | |  \| |\ `--.| |__ | |_/ / | | \ `--.    | |_  | |_/ / | | | .  . |   \ `--. | | | | | | | |_/ /| /  \/| |__     | | | / /_\ \| |/ /_\ \
 *    | | __ |  __|  | |       | | | . ` | `--. \  __||    /  | |  `--. \   |  _| |    /| | | | |\/| |    `--. \| | | | | | |    / | |    |  __|    | | | |  _  || ||  _  |
 *    | |_\ \| |___  | |      _| |_| |\  |/\__/ / |___| |\ \  | | /\__/ /   | |   | |\ \\ \_/ / |  | |   /\__/ /\ \_/ / |_| | |\ \ | \__/\| |___    | |/ /| | | || || | | |
 *     \____/\____/  \_/      \___/\_| \_/\____/\____/\_| \_| \_/ \____/    \_|   \_| \_|\___/\_|  |_/   \____/  \___/ \___/\_| \_| \____/\____/    |___/ \_| |_/\_/\_| |_/
 *    VIA POST REQUEST TO /api/fiscalismia/tsv/variable_expenses using
 *       fixedCostsTsv.tsv
 *       incomeTsv.tsv
 *       newFoodItemsTsv.tsv
 *       investments.tsv
 *       varExpensesTsv.tsv
 *    INSERT THESE VIA PGADMIN OR OTHER CLIENT WITH PROPER UTF-8 ENCODING FOR UMLAUTS AND NOT CMD
 */
 /**
  _____ _____  _______ ____       ____ ___  ____ _____ ____
 |  ___|_ _\ \/ / ____|  _ \     / ___/ _ \/ ___|_   _/ ___|
 | |_   | | \  /|  _| | | | |   | |  | | | \___ \ | | \___ \
 |  _|  | | /  \| |___| |_| |   | |__| |_| |___) || |  ___) |
 |_|   |___/_/\_\_____|____/     \____\___/|____/ |_| |____/
 */
INSERT INTO public.fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LIVING_ESSENTIALS',
  'Rent',
  1,
  660,
  660,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO public.fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'INTERNET_AND_PHONE',
  'DSL Telekom 100 MBit',
  1,
  44.95,
  44.95,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO public.fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'SPORTS_FACILITIES',
  'Gym Membership FitOne',
  1,
  29.9,
  29.9,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO public.fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'LIVING_ESSENTIALS',
  'Electricity Cost',
  1,
  85,
  85,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO public.fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
VALUES (
  'INSURANCE',
  'Liability Insurance',
  12,
  114.55,
  9.55,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
/**
  _____ _____  _______ ____      ___ _   _  ____ ___  __  __ _____
 |  ___|_ _\ \/ / ____|  _ \    |_ _| \ | |/ ___/ _ \|  \/  | ____|
 | |_   | | \  /|  _| | | | |    | ||  \| | |  | | | | |\/| |  _|
 |  _|  | | /  \| |___| |_| |    | || |\  | |__| |_| | |  | | |___
 |_|   |___/_/\_\_____|____/    |___|_| \_|\____\___/|_|  |_|_____|
*/
INSERT INTO public.fixed_income (description, type, monthly_interval, value, effective_date, expiration_date)
VALUES (
  'Company Net Salary',
  'net salary',
  1,
  3132.04,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO public.fixed_income (description, type, monthly_interval, value, effective_date, expiration_date)
VALUES (
  'Yearly 10% Performance Bonus',
  'net salary',
  12,
  2972.24,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO public.fixed_income (description, type, monthly_interval, value, effective_date, expiration_date)
VALUES (
  'Company Gross Salary',
  'gross salary',
  1,
  4673.34,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO public.fixed_income (description, type, monthly_interval, value, effective_date, expiration_date)
VALUES (
  'Government Inflation Compensation',
  'gross salary',
  1,
  166.66,
  TO_DATE('01.01.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);

/**
  ___ _   ___     _______ ____ _____ __  __ _____ _   _ _____ ____
 |_ _| \ | \ \   / / ____/ ___|_   _|  \/  | ____| \ | |_   _/ ___|
  | ||  \| |\ \ / /|  _| \___ \ | | | |\/| |  _| |  \| | | | \___ \
  | || |\  | \ V / | |___ ___) || | | |  | | |___| |\  | | |  ___) |
 |___|_| \_|  \_/  |_____|____/ |_| |_|  |_|_____|_| \_| |_| |____/
*/
INSERT INTO public.investments (execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date)
VALUES (
  'buy',
  'SYNBIOTIC SE NA O.N.',
  'DE000A3E5A59',
  'stock',
  'Tradegate',
  150,
  6.6,
  1001,
  11,
  TO_DATE('01.02.2024','DD.MM.YYYY')
);
INSERT INTO public.investments (execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date)
VALUES (
  'sell',
  'SYNBIOTIC SE NA O.N.',
  'DE000A3E5A59',
  'stock',
  'Tradegate',
  150,
  13.25,
  1977.5,
  10,
  TO_DATE('27.02.2024','DD.MM.YYYY')
);
INSERT INTO public.investment_taxes (investment_id, pct_of_profit_taxed, profit_amt, tax_paid, tax_year)
(
  SELECT
    id,
    0,
    977,
    0.00,
    extract( year FROM TO_DATE('27.02.2024','DD.MM.YYYY') )::int
  FROM public.investments
  WHERE isin = 'DE000A3E5A59'
    AND execution_date = TO_DATE('27.02.2024','DD.MM.YYYY')
    AND execution_type = 'sell' --unique key of public.investments
);
INSERT INTO public.investment_dividends (isin, dividend_amount, dividend_date)
VALUES('DE000A3E5A59', 24, TO_DATE('15.02.2024','DD.MM.YYYY'));

INSERT INTO public.investment_taxes (dividend_id, pct_of_profit_taxed, profit_amt, tax_paid, tax_year)
(
	SELECT
	id,
	0,
	24,
	0.00,
	2024
  FROM public.investment_dividends
  WHERE isin = 'DE000A3E5A59'
    AND dividend_date = TO_DATE('15.02.2024','DD.MM.YYYY')
   );

INSERT INTO public.bridge_investment_dividends (investment_id, dividend_id, remaining_units)
VALUES (1,1,150);
/**
  ____  _   _ ____  _____ ____  __  __    _    ____  _  _______ _____     _____ ___   ___  ____      ____  ____  ___ ____ _____ ____
 / ___|| | | |  _ \| ____|  _ \|  \/  |  / \  |  _ \| |/ / ____|_   _|   |  ___/ _ \ / _ \|  _ \    |  _ \|  _ \|_ _/ ___| ____/ ___|
 \___ \| | | | |_) |  _| | |_) | |\/| | / _ \ | |_) | ' /|  _|   | |     | |_ | | | | | | | | | |   | |_) | |_) || | |   |  _| \___ \
  ___) | |_| |  __/| |___|  _ <| |  | |/ ___ \|  _ <| . \| |___  | |     |  _|| |_| | |_| | |_| |   |  __/|  _ < | | |___| |___ ___) |
 |____/ \___/|_|   |_____|_| \_\_|  |_/_/   \_\_| \_\_|\_\_____| |_|     |_|   \___/ \___/|____/    |_|   |_| \_\___\____|_____|____/
*/
INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
VALUES (
  nextval('table_food_prices_seq'),
  'MCT Oil C-8, Organic',
  'GreatVita',
  'Amazon',
  'Fat',
  900,
  1000,
  24.99,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
VALUES (
  nextval('table_food_prices_seq'),
  'Black Olives, no stones',
  'Kings Crown',
  'Aldi Süd',
  'Fat',
  134,
  170,
  1.19,
  TO_DATE('01.03.2024','DD.MM.YYYY'),
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
VALUES (
  nextval('table_food_prices_seq'),
  'Basmati Rice',
  'Golden Sun',
  'Lidl',
  'Carbs',
  354,
  500,
  1.19,
  TO_DATE('15.02.2024','DD.MM.YYYY'),
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
VALUES (
  nextval('table_food_prices_seq'),
  'Salmon filet, frozen',
  'Paulus',
  'Kaufland',
  'Protein',
  223,
  1000,
  19.49,
  TO_DATE('10.03.2023','DD.MM.YYYY'),
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  TO_DATE('01.01.4000','DD.MM.YYYY')
);
INSERT INTO public.food_price_discounts(food_prices_dimension_key, discount_price, discount_start_date, discount_end_date)
VALUES(3,1.49,TO_DATE('01.04.2024','DD.MM.YYYY'),TO_DATE('31.12.2024','DD.MM.YYYY'));

/**
 __     ___    ____  ___    _    ____  _     _____       _______  ______  _____ _   _ ____  _____ ____
 \ \   / / \  |  _ \|_ _|  / \  | __ )| |   | ____|     | ____\ \/ /  _ \| ____| \ | / ___|| ____/ ___|
  \ \ / / _ \ | |_) || |  / _ \ |  _ \| |   |  _|       |  _|  \  /| |_) |  _| |  \| \___ \|  _| \___ \
   \ V / ___ \|  _ < | | / ___ \| |_) | |___| |___      | |___ /  \|  __/| |___| |\  |___) | |___ ___) |
    \_/_/   \_\_| \_\___/_/   \_\____/|_____|_____|     |_____/_/\_\_|   |_____|_| \_|____/|_____|____/
*/
INSERT INTO staging.staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
  'Cola Zero, Energy Zero',
  INITCAP('Groceries'),
  INITCAP('Kiosk'),
  4.2,
  TO_DATE('01.04.2024','DD.MM.YYYY'),
  'N',
  'J',
  LOWER('caffeine, aspartame/saccharin')
);
INSERT INTO staging.staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
  'Chicken, Carrots, Broccoli, Coconut Milk',
  INITCAP('Groceries'),
  INITCAP('Aldi Süd'),
  10.77,
  TO_DATE('05.04.2024','DD.MM.YYYY'),
  'J',
  'N',
  LOWER('')
);
INSERT INTO staging.staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
  'Riesling Wine, Dry',
  INITCAP('Leisure'),
  INITCAP('Gas Station'),
  5.9,
  TO_DATE('03.04.2024','DD.MM.YYYY'),
  'N',
  'J',
  LOWER('alcohol')
);
INSERT INTO staging.staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
  'Ibanez Xiphos XPT700 E-Gitarre',
  INITCAP('Sale'),
  INITCAP('Ebay'),
  367,
  TO_DATE('13.04.2024','DD.MM.YYYY'),
  'J',
  'N',
  LOWER('')
);
INSERT INTO staging.staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
  'Grandma Birthday Present',
  INITCAP('Gift'),
  INITCAP('Family'),
  50,
  TO_DATE('21.04.2024','DD.MM.YYYY'),
  'J',
  'N',
  LOWER('')
);
INSERT INTO staging.staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
VALUES (
  'Face Wash, Tooth Paste',
  INITCAP('Hygiene'),
  INITCAP('dm'),
  5.1,
  TO_DATE('02.04.2024','DD.MM.YYYY'),
  'J',
  'N',
  LOWER('')
);

SELECT ETL_VARIABLE_EXPENSES();
TRUNCATE TABLE staging.staging_variable_bills;