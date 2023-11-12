--          __   ___  __  ___           ___  __      __  ___      ___  ___        ___      ___  __
--  | |\ | /__` |__  |__)  |     | |\ |  |  /  \    /__`  |   /\   |  |__   |\/| |__  |\ |  |  /__`
--  | | \| .__/ |___ |  \  |     | | \|  |  \__/    .__/  |  /~~\  |  |___  |  | |___ | \|  |  .__/

-- PUBLIC
TRUNCATE TABLE staging.staging_variable_bills;
TRUNCATE TABLE staging.staging_variable_bill_sensitivity;
TRUNCATE TABLE public.test_table;
TRUNCATE TABLE public.bridge_var_exp_sensitivity;
TRUNCATE TABLE public.sensitivity CASCADE;
TRUNCATE TABLE public.variable_expenses CASCADE;
TRUNCATE TABLE public.store CASCADE;
TRUNCATE TABLE public.category CASCADE;

INSERT INTO public.test_table (description) VALUES ('Hello from pg 14.5 database');
INSERT INTO public.test_table (description) VALUES ('This is a local Windows pgsql db');

INSERT INTO public.category (description) VALUES ('Groceries');
INSERT INTO public.category (description) VALUES ('Medical Expenses');
INSERT INTO public.category (description) VALUES ('Substances');
INSERT INTO public.category (description) VALUES ('Supplements');
INSERT INTO public.category (description) VALUES ('Leisure');
INSERT INTO public.category (description) VALUES ('Deposit');

INSERT INTO public.store (description) VALUES ('Lidl');
INSERT INTO public.store (description) VALUES ('Aldi Süd');
INSERT INTO public.store (description) VALUES ('Edeka');
INSERT INTO public.store (description) VALUES ('Müller');
INSERT INTO public.store (description) VALUES ('Rossmann');
INSERT INTO public.store (description) VALUES ('Kaufland');
INSERT INTO public.store (description) VALUES ('Gas Station');
INSERT INTO public.store (description) VALUES ('Café');
INSERT INTO public.store (description) VALUES ('Dm');
INSERT INTO public.store (description) VALUES ('Rewe');
INSERT INTO public.store (description) VALUES ('Apotheke');
INSERT INTO public.store (description) VALUES ('Ebl Biomarkt');
INSERT INTO public.store (description, is_online) VALUES ('Amazon', TRUE);

INSERT INTO public.sensitivity (description, severity_rating) VALUES ('caffeine', 1);
INSERT INTO public.sensitivity (description, severity_rating) VALUES ('alcohol', 2);
INSERT INTO public.sensitivity (description, severity_rating) VALUES ('aspartame/saccharin', 2);
INSERT INTO public.sensitivity (description, severity_rating) VALUES ('nightshade', 2);
INSERT INTO public.sensitivity (description, severity_rating) VALUES ('cow''s milk product', 4);
INSERT INTO public.sensitivity (description, severity_rating) VALUES ('citrus fruit', 5);
INSERT INTO public.sensitivity (description, severity_rating) VALUES ('soy product', 5);

INSERT INTO public.variable_expenses (description, category_id, store_id, cost, purchasing_date, is_planned, contains_indulgence)
    VALUES (
        'Salat, Energy Zero, Putenbrust',
        (SELECT id FROM category WHERE description = 'Groceries'),
        (SELECT id FROM store WHERE description = 'Lidl'),
        11.31,
        '2022-04-20',
        TRUE,
        TRUE
    );

INSERT INTO public.bridge_var_exp_sensitivity (variable_expense_id, sensitivity_id)
    VALUES (
        (SELECT id FROM variable_expenses WHERE description = 'Salat, Energy Zero, Putenbrust'),
        (SELECT id FROM sensitivity WHERE description = 'aspartame/saccharin')
    );
INSERT INTO public.bridge_var_exp_sensitivity (variable_expense_id, sensitivity_id)
    VALUES (
        (SELECT id FROM variable_expenses WHERE description = 'Salat, Energy Zero, Putenbrust'),
        (SELECT id FROM sensitivity WHERE description = 'caffeine')
    );

--   ___ ___          __   __   __   __   ___  __   __
--  |__   |  |       |__) |__) /  \ /  ` |__  /__` /__`
--  |___  |  |___    |    |  \ \__/ \__, |___ .__/ .__/

TRUNCATE TABLE staging.staging_variable_bills;
INSERT INTO staging.staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
    VALUES (
        'Käse, Softdrinks',
        INITCAP('TEST_CATEGORY'),
        INITCAP('TEST_STORE'),
        69.35,
        '2022-05-12',
        'N',
        'J',
        LOWER('caffeine , aspartame/saccharin, cow''s milk product')
    );
INSERT INTO staging.staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
    VALUES (
        'Tomaten, Crunchy Oats, Whiskey, Energy Drinks',
        INITCAP('TEST_CATEGORY2'),
        INITCAP('TEST_STORE2'),
        43.35,
        '2022-05-17',
        'J',
        'N',
        LOWER('alcohol , sugar , nightshade ,caffeine ,aspartame/saccharin ')
    );
/*     __   ___            __                __      __     __   __   __            ___  __
 *    |  \ |__   /\  |    /__`     /\  |\ | |  \    |  \ | /__` /  ` /  \ |  | |\ |  |  /__`
 *    |__/ |___ /~~\ |___ .__/    /~~\ | \| |__/    |__/ | .__/ \__, \__/ \__/ | \|  |  .__/
 */
 -- Food Prices
INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Oatly Cuisine 15%',
        'Oatly',
        'Alle',
        'Fat',
        150,
        250,
        1.29,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Schafskäse, leicht',
        'Salakis',
        'Alle',
        'Protein',
        161,
        150,
        3.29,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Heidelbeeren TK',
        'All Seasons',
        'Aldi Süd',
        'Carbs',
        59,
        500,
        2.99,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Haferflocken zart, Bio',
        'Gut Bio',
        'Aldi Süd',
        'Carbs',
        375,
        500,
        0.95,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Eismeergarnelen / Party-Garnelen',
        'Almare Seafood',
        'Aldi Süd',
        'Protein',
        88,
        100,
        2.29,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Riesen Garnelenschwänze TK',
        'Golden Seafood',
        'Aldi Süd',
        'Protein',
        65,
        225,
        3.69,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Eismeergarnelen TK',
        'Golden Seafood',
        'Aldi Süd',
        'Protein',
        67,
        225,
        3.69,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Kap-Seehecht Filet zitrone',
        'Golden Seafood',
        'Aldi Süd',
        'Protein',
        82,
        400,
        4.89,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Kap-Seehecht Filet natur',
        'Golden Seafood',
        'Aldi Süd',
        'Protein',
        77,
        360,
        4.89,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Eier, Bio',
        '10er',
        'Aldi Süd',
        'Protein',
        137,
        600,
        3.29,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Kokosnussmilch, regulär',
        'Asia green garden',
        'Aldi Süd',
        'Fat',
        207,
        400,
        1.19,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Irisches Weiderind Rib-Eye Steak',
        'Taste of Ireland',
        'Aldi Süd',
        'Protein',
        197,
        1000,
        29.99,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Irisches Weiderind Rumpsteak',
        'Taste of Ireland',
        'Aldi Süd',
        'Protein',
        199,
        1000,
        29.99,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Rind Hüftsteak',
        'Meine Metzgerei',
        'Aldi Süd',
        'Protein',
        115,
        1000,
        22.99,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Rinderhack 5%',
        'Meine Metzgerei',
        'Aldi Süd',
        'Protein',
        125,
        400,
        4.29,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Blumenkohl TK',
        'All Seasons',
        'Aldi Süd',
        'Fiber',
        22,
        1000,
        1.99,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Brokkoli TK',
        'All Seasons',
        'Aldi Süd',
        'Fiber',
        26,
        1000,
        1.99,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Karottenmix TK, Bio',
        'Gut Bio',
        'Aldi Süd',
        'Fiber',
        42,
        750,
        2.69,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Blumenkohl TK, Bio',
        'Gut Bio',
        'Aldi Süd',
        'Fiber',
        28,
        750,
        2.69,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Kaisergemüse TK, Bio',
        'Gut Bio',
        'Aldi Süd',
        'Fiber',
        28,
        750,
        2.69,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Milchreis',
        'Bon-Ri',
        'Aldi Süd',
        'Carbs',
        349,
        500,
        1.19,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Schwarze Oliven, entsteint',
        'Kings Crown',
        'Aldi Süd',
        'Fat',
        134,
        170,
        1.19,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Chia Samen',
        'GreatVita',
        'Amazon',
        'Fat',
        444,
        1000,
        9.99,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Hanfprotein',
        'SevenHills',
        'Amazon',
        'Protein',
        349,
        2000,
        26.59,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Kakao, entölt',
        'Biotiva',
        'Amazon',
        'Protein',
        330,
        1000,
        15.99,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Leinsamen, geschrotet',
        'Davert',
        'Amazon',
        'Fat',
        530,
        1200,
        12.9,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Leinsamenmehl, teilentölt',
        'bioKontor',
        'Amazon',
        'Protein',
        315,
        2000,
        15.9,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'MCT Öl C-8, Bio ´',
        'GreatVita',
        'Amazon',
        'Fat',
        900,
        1000,
        24.99,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Sauerkirschsaft',
        'BOMs',
        'Amazon',
        'Carbs',
        49,
        5000,
        22.5,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Buchweizen Pasta',
        'Seitz',
        'Kaufland',
        'Carbs',
        354,
        500,
        3.49,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'High-Oleic Sonnenblumenöl, Bio',
        'Teutoburger Ölmühle',
        'Kaufland',
        'Fat',
        898,
        500,
        5.39,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Seelachsfilet TK',
        'Paulus',
        'Kaufland',
        'Protein',
        64,
        1000,
        7.49,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Kabeljau TK',
        'Paulus',
        'Kaufland',
        'Protein',
        73,
        1000,
        11.99,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Hähnchen Kasseler',
        'Könecke',
        'Kaufland',
        'Protein',
        115,
        150,
        1.89,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Schwarze Oliven, entsteint',
        'Hutesa',
        'Kaufland',
        'Fat',
        122,
        400,
        3.69,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'High-Oleic Sonnenblumenöl',
        'Pro-Oleic',
        'Kaufland',
        'Fat',
        898,
        750,
        5.49,
        TO_DATE('31.10.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Kapern',
        'K-Classic',
        'Kaufland',
        'Fiber',
        26,
        100,
        0.79,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Eier XXL, Bio',
        '15er',
        'Lidl',
        'Protein',
        137,
        900,
        4.09,
        TO_DATE('31.10.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Eier, Bio',
        '10er',
        'Lidl',
        'Protein',
        137,
        600,
        3.29,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Eismeergarnelen',
        'nautica',
        'Lidl',
        'Protein',
        85,
        100,
        2.29,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Party-Garnelen',
        'nautica',
        'Lidl',
        'Protein',
        87,
        100,
        2.29,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Fenchel, lose',
        '',
        'Lidl',
        'Fiber',
        28,
        1000,
        1.99,
        TO_DATE('11.11.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Gemüsezwiebeln, Netz',
        '',
        'Lidl',
        'Fiber',
        28,
        750,
        1.89,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Milchreis',
        'Golden Sun',
        'Lidl',
        'Carbs',
        354,
        500,
        1.19,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Haferflocken zart, Bio',
        'Crownfield',
        'Lidl',
        'Carbs',
        375,
        500,
        0.95,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Heidelbeeren TK',
        'Freshona',
        'Lidl',
        'Carbs',
        57,
        500,
        2.99,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Kaisergemüse TK, Bio',
        'Freshona',
        'Lidl',
        'Fiber',
        28,
        750,
        2.49,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Lachs mit Haut, Hälfte',
        '',
        'Lidl',
        'Protein',
        180,
        1000,
        19.99,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Lachsfiletportionen, ohne Haut XXL TK',
        'OceanSea',
        'Lidl',
        'Protein',
        223,
        600,
        15.84,
        TO_DATE('31.10.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Lachsfiletportionen, ohne Haut TK',
        'OceanSea',
        'Lidl',
        'Protein',
        223,
        375,
        8.99,
        TO_DATE('31.10.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Lachsspitzen ohne Haut TK',
        'ASC',
        'Lidl',
        'Protein',
        135,
        455,
        9.99,
        TO_DATE('11.11.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Lauch / Porree',
        '',
        'Lidl',
        'Fiber',
        28,
        250,
        0.69,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Reiswaffeln mit Salz, Bio',
        '',
        'Lidl',
        'Carbs',
        383,
        130,
        0.89,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Rinderhack 5%',
        '',
        'Lidl',
        'Protein',
        125,
        400,
        4.29,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'rote Zwiebeln, Netz',
        '',
        'Lidl',
        'Fiber',
        28,
        1000,
        1.99,
        TO_DATE('11.11.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Schwarze Oliven, entsteint',
        'Baresa',
        'Lidl',
        'Fat',
        134,
        160,
        0.99,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Zwiebeln, 2kg Netz',
        '',
        'Lidl',
        'Fiber',
        28,
        2000,
        3.49,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Leinsamen, geschrotet',
        'Crownfield',
        'Lidl',
        'Fat',
        518,
        400,
        1.89,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'rote Zwiebeln, Bio, Netz',
        '',
        'Lidl',
        'Fiber',
        28,
        500,
        0.99,
        TO_DATE('04.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Kapern',
        'Freshona',
        'Lidl',
        'Fiber',
        29,
        60,
        0.89,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Eismeergarnelen TK',
        'Ocean Sea',
        'Lidl',
        'Protein',
        66,
        270,
        4.39,
        TO_DATE('11.11.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Gurke',
        '',
        'Lidl',
        'Fiber',
        12,
        800,
        0.99,
        TO_DATE('11.11.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Gemüsezwiebeln, einzeln',
        '',
        'Lidl',
        'Fiber',
        36,
        1000,
        2.99,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Kabeljau TK',
        'Ocean Sea',
        'Lidl',
        'Protein',
        75,
        540,
        6.99,
        TO_DATE('11.11.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Lachsfilets ohne Haut TK',
        'Ocean Sea',
        'Lidl',
        'Protein',
        233,
        250,
        5.99,
        TO_DATE('11.11.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Schwarze Oliven, entsteint',
        'Aro',
        'Metro',
        'Fat',
        125,
        460,
        2.78,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Rindertartar',
        '',
        'Metzger',
        'Protein',
        133,
        1000,
        19.99,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Fischöl, flüssig',
        'St. Bernhard',
        'Online',
        'Fat',
        900,
        250,
        12.5,
        TO_DATE('31.07.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Sauerkirschen TK',
        'Rewe Beste Wahl',
        'Rewe',
        'Carbs',
        53,
        300,
        1.79,
        TO_DATE('15.08.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Karotten, 2kg Sack',
        '',
        'Lidl',
        'Fiber',
        38,
        2000,
        1.49,
        TO_DATE('11.11.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Bio Gurke',
        '',
        'Lidl',
        'Fiber',
        12,
        600,
        0.99,
        TO_DATE('11.11.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Bio Karotten, lose',
        'Bioland',
        'Lidl',
        'Fiber',
        38,
        1000,
        1.99,
        TO_DATE('11.11.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        'Dill, Bund',
        '',
        'Lidl',
        'Fiber',
        43,
        150,
        1.59,
        TO_DATE('11.11.2023','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
-- Food Price Discounts
INSERT INTO public.food_price_discounts(
	food_prices_dimension_key, discount_price, discount_start_date, discount_end_date)
	VALUES ((SELECT dimension_key FROM public.table_food_prices WHERE food_item = 'Haferflocken zart, Bio'), 0.85, current_date, current_date+7);
INSERT INTO public.food_price_discounts(
	food_prices_dimension_key, discount_price, discount_start_date, discount_end_date)
	VALUES ((SELECT dimension_key FROM public.table_food_prices WHERE food_item = 'Eier, Bio'), 2.79, current_date-1, current_date+4);