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