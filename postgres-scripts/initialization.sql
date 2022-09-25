-- psql -U postgres
-- PW
--        __                  __  ___  __       ___    __                __   ___  __    |    __   __   __  ___  __   __   ___  __
--   /\  |  \  |\/| | |\ | | /__`  |  |__)  /\   |  | /  \ |\ |    |  | /__` |__  |__)   |   |__) /  \ /__`  |  / _` |__) |__  /__`
--  /~~\ |__/  |  | | | \| | .__/  |  |  \ /~~\  |  | \__/ | \|    \__/ .__/ |___ |  \   |   |    \__/ .__/  |  \__> |  \ |___ .__/

\c fiscalismia
DROP SCHEMA IF EXISTS public;
DROP SCHEMA IF EXISTS staging;
\c postgres
DROP DATABASE IF EXISTS fiscalismia;
DROP ROLE IF EXISTS fiscalismia_api;
CREATE ROLE fiscalismia_api WITH
	LOGIN
	SUPERUSER
	CREATEDB
	NOCREATEROLE
	NOINHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	-- PASSWORD 'PLACEHOLER';

DROP DATABASE IF EXISTS fiscalismia;
CREATE DATABASE fiscalismia
    WITH
    OWNER = fiscalismia_api
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
COMMENT ON DATABASE fiscalismia IS 'db for the fiscalismia webservice';
\c fiscalismia
ALTER SCHEMA public OWNER TO fiscalismia_api;

-- QUIT OUT via  \q
-- psql -U fiscalismia_api -d fiscalismia

--        __                  __  ___  __       ___    __                __   ___  __    |    ___    __   __               __                         __
--   /\  |  \  |\/| | |\ | | /__`  |  |__)  /\   |  | /  \ |\ |    |  | /__` |__  |__)   |   |__  | /__` /  `  /\  |    | /__`  |\/| |  /\       /\  |__) |
--  /~~\ |__/  |  | | | \| | .__/  |  |  \ /~~\  |  | \__/ | \|    \__/ .__/ |___ |  \   |   |    | .__/ \__, /~~\ |___ | .__/  |  | | /~~\ ___ /~~\ |    |

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA IF NOT EXISTS public AUTHORIZATION fiscalismia_api;
COMMENT ON SCHEMA public IS 'standard public schema containing data accessible from outside';
GRANT ALL ON SCHEMA public TO PUBLIC;
GRANT ALL ON SCHEMA public TO fiscalismia_api;

CREATE SCHEMA IF NOT EXISTS staging AUTHORIZATION fiscalismia_api;
COMMENT ON SCHEMA staging IS 'schema for ETL processes performed prior to insertion into public schema';
GRANT ALL ON SCHEMA staging TO fiscalismia_api;

--   __   __   ___      ___  ___    ___       __        ___     __  ___      ___  ___        ___      ___  __
--  /  ` |__) |__   /\   |  |__      |   /\  |__) |    |__     /__`  |   /\   |  |__   |\/| |__  |\ |  |  /__`
--  \__, |  \ |___ /~~\  |  |___     |  /~~\ |__) |___ |___    .__/  |  /~~\  |  |___  |  | |___ | \|  |  .__/

-- STAGING
DROP TABLE IF EXISTS staging.staging_variable_bills;
DROP TABLE IF EXISTS staging.staging_variable_bill_sensitivity;

CREATE TABLE IF NOT EXISTS staging.staging_variable_bills
(
    id serial NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    category character varying(100) NOT NULL,
    store character varying(100) NOT NULL,
    cost numeric(6,2) NOT NULL,
    purchasing_date date NOT NULL,
    is_planned character varying(1),
    contains_indulgence character varying(1),
    sensitivities character varying(255) COLLATE pg_catalog."default"
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS staging.staging_variable_bills
    OWNER to fiscalismia_api;

-- PUBLIC
DROP TABLE IF EXISTS public.bridge_var_exp_sensitivity;
DROP TABLE IF EXISTS public.variable_expenses;
DROP TABLE IF EXISTS public.category;
DROP TABLE IF EXISTS public.store;
DROP TABLE IF EXISTS public.sensitivity;
DROP TABLE IF EXISTS public.test_table;

CREATE TABLE IF NOT EXISTS public.test_table
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.test_table
    OWNER to fiscalismia_api;

CREATE TABLE public.category
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.category OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS public.category ADD CONSTRAINT uk_category UNIQUE (description);

CREATE TABLE public.store
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    is_online boolean DEFAULT FALSE,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.store OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS public.store ADD CONSTRAINT uk_store UNIQUE (description);

CREATE TABLE public.sensitivity
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    severity_rating smallint,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.sensitivity OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS public.sensitivity ADD CONSTRAINT uk_sensitivity UNIQUE (description);

CREATE TABLE IF NOT EXISTS public.variable_expenses
(
    id serial NOT NULL ,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    category_id integer NOT NULL,
    store_id integer NOT NULL,
    cost numeric(6,2) NOT NULL,
    purchasing_date date NOT NULL DEFAULT CURRENT_DATE,
    is_planned boolean,
    contains_indulgence boolean,
    CONSTRAINT "variable_expenses_pkey" PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public.variable_expenses OWNER to fiscalismia_api;
COMMENT ON TABLE public.variable_expenses IS 'contains daily expenses such as groceries, purchases for leisure time, health and medical expenses';
ALTER TABLE IF EXISTS public.variable_expenses
    ADD CONSTRAINT "var_exp_cat" FOREIGN KEY (category_id)
    REFERENCES public.category (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
ALTER TABLE IF EXISTS public.variable_expenses
    ADD CONSTRAINT "var_exp_store" FOREIGN KEY (store_id)
    REFERENCES public.store (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
ALTER TABLE IF EXISTS public.variable_expenses ADD CONSTRAINT uk_variable_expenses UNIQUE (category_id,store_id,cost,purchasing_date);

CREATE TABLE IF NOT EXISTS public.bridge_var_exp_sensitivity
(
    id serial NOT NULL ,
    variable_expense_id integer NOT NULL,
    sensitivity_id integer NOT NULL,
    CONSTRAINT "bridge_var_exp_sensitivity_pkey" PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public.bridge_var_exp_sensitivity OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS public.bridge_var_exp_sensitivity
    ADD CONSTRAINT "b_var_exp_sens_to_sens" FOREIGN KEY (sensitivity_id)
    REFERENCES public.sensitivity (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
ALTER TABLE IF EXISTS public.bridge_var_exp_sensitivity
    ADD CONSTRAINT "b_var_exp_sens_to_exp" FOREIGN KEY (variable_expense_id)
    REFERENCES public.variable_expenses (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;

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

-- INSERT INTO public.test_table (description) VALUES ('Hello from pg 14.5 database');
-- INSERT INTO public.test_table (description) VALUES ('This is a local Windows pgsql db');

-- INSERT INTO public.category (description) VALUES ('Groceries');
-- INSERT INTO public.category (description) VALUES ('Medical Expenses');
-- INSERT INTO public.category (description) VALUES ('Substances');
-- INSERT INTO public.category (description) VALUES ('Supplements');
-- INSERT INTO public.category (description) VALUES ('Leisure');
-- INSERT INTO public.category (description) VALUES ('Deposit');

-- INSERT INTO public.store (description) VALUES ('Lidl');
-- INSERT INTO public.store (description) VALUES ('Aldi Süd');
-- INSERT INTO public.store (description) VALUES ('Edeka');
-- INSERT INTO public.store (description) VALUES ('Müller');
-- INSERT INTO public.store (description) VALUES ('Rossmann');
-- INSERT INTO public.store (description) VALUES ('Kaufland');
-- INSERT INTO public.store (description) VALUES ('Gas Station');
-- INSERT INTO public.store (description) VALUES ('Café');
-- INSERT INTO public.store (description) VALUES ('Dm');
-- INSERT INTO public.store (description) VALUES ('Rewe');
-- INSERT INTO public.store (description) VALUES ('Apotheke');
-- INSERT INTO public.store (description) VALUES ('Ebl Biomarkt');
-- INSERT INTO public.store (description, is_online) VALUES ('Amazon', TRUE);

-- INSERT INTO public.sensitivity (description, severity_rating) VALUES ('caffeine', 1);
-- INSERT INTO public.sensitivity (description, severity_rating) VALUES ('alcohol', 2);
-- INSERT INTO public.sensitivity (description, severity_rating) VALUES ('aspartame/saccharin', 2);
-- INSERT INTO public.sensitivity (description, severity_rating) VALUES ('nightshade', 2);
-- INSERT INTO public.sensitivity (description, severity_rating) VALUES ('cow''s milk product', 4);
-- INSERT INTO public.sensitivity (description, severity_rating) VALUES ('citrus fruit', 5);
-- INSERT INTO public.sensitivity (description, severity_rating) VALUES ('soy product', 5);

-- INSERT INTO public.variable_expenses (description, category_id, store_id, cost, purchasing_date, is_planned, contains_indulgence)
--     VALUES (
--         'Salat, Energy Zero, Putenbrust',
--         (SELECT id FROM category WHERE description = 'Groceries'),
--         (SELECT id FROM store WHERE description = 'Lidl'),
--         11.31,
--         '2022-04-20',
--         TRUE,
--         TRUE
--     );

-- INSERT INTO public.bridge_var_exp_sensitivity (variable_expense_id, sensitivity_id)
--     VALUES (
--         (SELECT id FROM variable_expenses WHERE description = 'Salat, Energy Zero, Putenbrust'),
--         (SELECT id FROM sensitivity WHERE description = 'aspartame/saccharin')
--     );
-- INSERT INTO public.bridge_var_exp_sensitivity (variable_expense_id, sensitivity_id)
--     VALUES (
--         (SELECT id FROM variable_expenses WHERE description = 'Salat, Energy Zero, Putenbrust'),
--         (SELECT id FROM sensitivity WHERE description = 'caffeine')
--     );

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
-- Insert CATEGORIES not yet present in DB
INSERT INTO public.category (description)  (
    SELECT
		INITCAP(stg.category) as description
    FROM staging.staging_variable_bills stg
    WHERE stg.category NOT IN (
        SELECT description
        FROM public.category
    )
    GROUP BY stg.category
);
-- Insert STORES not yet present in DB
INSERT INTO public.store (description)  (
    SELECT
		INITCAP(stg.store) as description
    FROM staging.staging_variable_bills stg
    WHERE stg.store NOT IN (
        SELECT description
        FROM public.store
    )
    GROUP BY stg.store
);
-- Insert SENSITIVITIES not yet present in DB
INSERT INTO public.sensitivity (description,severity_rating) (
	SELECT
		split.sensitivity as description,
		NULL as severity_rating
	FROM (
		SELECT DISTINCT
			-- 1) split comma separated string into array.
			-- 2) unnest array into tuples.
			-- 3) transform string (trim, lowercase)
			LOWER(TRIM(unnest(string_to_array(stg.sensitivities, ',')))) AS sensitivity
		FROM staging.staging_variable_bills stg
		) split
	WHERE sensitivity NOT IN (
        SELECT description
        FROM public.sensitivity
    )
);
-- Insert VARIABLE_EXPENSES from staging to public schema
INSERT INTO public.variable_expenses (description, category_id, store_id, cost, purchasing_date, is_planned, contains_indulgence) (
    SELECT
        stg.description,
        (SELECT id FROM public.category WHERE description = stg.category) as category_id,
        (SELECT id FROM public.store WHERE description = stg.store) as store_id,
        stg.cost,
        stg.purchasing_date,
        CASE WHEN stg.is_planned = 'J' THEN TRUE
            WHEN stg.is_planned = 'N' THEN FALSE
            ELSE FALSE
        END is_planned,
        CASE WHEN stg.contains_indulgence = 'J' THEN TRUE
            WHEN stg.contains_indulgence = 'N' THEN FALSE
            ELSE FALSE
        END contains_indulgence
    FROM staging.staging_variable_bills stg
);
-- Insert BRIDGE_VAR_EXP_SENSITIVITY from staging to public schema
do
$$
declare
	s record; -- one s for each row in staging_variable_bills
    f record; -- one f for each individual sensitivity in staging_variable_bills.sensitivities delimited by ','
begin
	for s in select * from staging.staging_variable_bills
	loop
		for f in
            SELECT DISTINCT
                -- 1) split comma separated string into array.
			    -- 2) unnest array into tuples.
			    -- 3) transform string (trim, lowercase)
                LOWER(TRIM(unnest(string_to_array(stg.sensitivities, ',')))) as sensitivity
		    FROM staging.staging_variable_bills stg
		    WHERE stg.id = s.id
		loop
		--raise notice '|%|%|%|%| ==> %', s.category, s.store, s.cost, s.purchasing_date, f.sensitivity;
		INSERT INTO public.bridge_var_exp_sensitivity (variable_expense_id, sensitivity_id) VALUES
		(
			 (SELECT id
			  FROM public.variable_expenses
				WHERE cost = s.cost
					AND purchasing_date = s.purchasing_date
					AND category_id = (
						SELECT id FROM public.category WHERE description = s.category)
					AND store_id = (
						SELECT id FROM public.store WHERE description = s.store)
			 	) ,
				 (SELECT id
				 FROM public.sensitivity
				 WHERE description = f.sensitivity) )
		;
		end loop;
	end loop;
end;
$$;