psql -U postgres
-- PG_SUPERUSER_PW

/*    __                  __  ___  __       ___    __                __   ___  __    |    __   __   __  ___  __   __   ___  __
 /\  |  \  |\/| | |\ | | /__`  |  |__)  /\   |  | /  \ |\ |    |  | /__` |__  |__)   |   |__) /  \ /__`  |  / _` |__) |__  /__`
/~~\ |__/  |  | | | \| | .__/  |  |  \ /~~\  |  | \__/ | \|    \__/ .__/ |___ |  \   |   |    \__/ .__/  |  \__> |  \ |___ .__/
*/
SET client_encoding TO 'UTF8';
\c fiscalismia
DROP SCHEMA IF EXISTS public CASCADE;
DROP SCHEMA IF EXISTS staging CASCADE;
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
	PASSWORD 'donkeybirdbansheetilt';

DROP DATABASE IF EXISTS fiscalismia;
CREATE DATABASE fiscalismia
    WITH
    OWNER = fiscalismia_api
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
COMMENT ON DATABASE fiscalismia IS 'db for the fiscalismia webservice';
\c fiscalismia
SET client_encoding TO 'UTF8';
ALTER SCHEMA public OWNER TO fiscalismia_api;
\q
psql -U fiscalismia_api -d fiscalismia
--PG_PW

/*      __                  __  ___  __       ___    __                __   ___  __    |    ___    __   __               __                         __
   /\  |  \  |\/| | |\ | | /__`  |  |__)  /\   |  | /  \ |\ |    |  | /__` |__  |__)   |   |__  | /__` /  `  /\  |    | /__`  |\/| |  /\       /\  |__) |
  /~~\ |__/  |  | | | \| | .__/  |  |  \ /~~\  |  | \__/ | \|    \__/ .__/ |___ |  \   |   |    | .__/ \__, /~~\ |___ | .__/  |  | | /~~\ ___ /~~\ |    | */

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA IF NOT EXISTS public AUTHORIZATION fiscalismia_api;
COMMENT ON SCHEMA public IS 'standard public schema containing data accessible from outside';
GRANT ALL ON SCHEMA public TO PUBLIC;
GRANT ALL ON SCHEMA public TO fiscalismia_api;

DROP SCHEMA IF EXISTS staging CASCADE;
CREATE SCHEMA IF NOT EXISTS staging AUTHORIZATION fiscalismia_api;
COMMENT ON SCHEMA staging IS 'schema for ETL processes performed prior to insertion into public schema';
GRANT ALL ON SCHEMA staging TO fiscalismia_api;

/*___     ___  ___       __     __        __
 |__  \_/  |  |__  |\ | /__` | /  \ |\ | /__`
 |___ / \  |  |___ | \| .__/ | \__/ | \| .__/

>pgcrypto<
Documentation: https://www.postgresql.org/docs/current/pgcrypto.html
ENCRYPT: crypt('PASSWORD', gen_salt('bf',ITER_COUNT))
ITER_COUNT = difficulty of hashing. 6 is default and 31 is max but takes years to compute
DECRYPT: crypt('ENTERED_PW', password_from_table)

>CITEXT<
Extension for Case Sensitive Text field for e.g. emails */
CREATE EXTENSION pgcrypto;
CREATE EXTENSION citext;

DROP TABLE IF EXISTS public.um_users;
CREATE TABLE IF NOT EXISTS public.um_users (
	id serial NOT NULL,
  	username character varying(255) NOT NULL UNIQUE,
    email citext NOT NULL UNIQUE,
  	password TEXT NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO public.um_users (username, email, password) VALUES
('admin',
 'herp_derp@gmail.io',
  crypt('derpdonkeybonkturdlick', gen_salt('bf',12)));

SELECT * FROM public.um_users
WHERE username = 'admin'
  AND password = crypt('derpdonkeybonkturdlick', password);
/* __   __   ___      ___  ___    ___       __        ___     __  ___      ___  ___        ___      ___  __
  /  ` |__) |__   /\   |  |__      |   /\  |__) |    |__     /__`  |   /\   |  |__   |\/| |__  |\ |  |  /__`
  \__, |  \ |___ /~~\  |  |___     |  /~~\ |__) |___ |___    .__/  |  /~~\  |  |___  |  | |___ | \|  |  .__/
  */

DROP TABLE IF EXISTS staging.staging_variable_bills;

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

-- TEST
DROP TABLE IF EXISTS public.test_table;
-- FIXED COSTS
DROP TABLE IF EXISTS public.fixed_costs;
-- VARIABLE EXPENSES
DROP TABLE IF EXISTS public.bridge_var_exp_sensitivity;
DROP TABLE IF EXISTS public.variable_expenses;
DROP TABLE IF EXISTS public.category;
DROP TABLE IF EXISTS public.store;
DROP TABLE IF EXISTS public.sensitivity;
-- DEALS & DISCOUNTS
DROP VIEW IF EXISTS public.v_food_price_overview ;
DROP TABLE IF EXISTS public.food_price_discounts;
DROP TABLE IF EXISTS public.table_food_prices;
DROP SEQUENCE IF EXISTS public.table_food_prices_seq;

CREATE TABLE IF NOT EXISTS public.test_table
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.test_table
    OWNER to fiscalismia_api;

/**    ___        ___  __      __   __   __  ___  __
 *    |__  | \_/ |__  |  \    /  ` /  \ /__`  |  /__`
 *    |    | / \ |___ |__/    \__, \__/ .__/  |  .__/
 */

CREATE TABLE IF NOT EXISTS public.fixed_costs
(
    id serial NOT NULL,
    category character varying(128) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    monthly_interval numeric(4,2) NOT NULL,
    billed_cost numeric(7,2) NOT NULL,
    monthly_cost numeric(7,2) NOT NULL,
    effective_date date NOT NULL,
	expiration_date date NOT NULL
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public.fixed_costs
    OWNER to fiscalismia_api;
COMMENT ON TABLE public.fixed_costs IS 'contains fixed costs being paid regularly, their billing interval and categories for filtering and displaying';

/*     __   ___            __                __      __     __   __   __            ___  __
 *    |  \ |__   /\  |    /__`     /\  |\ | |  \    |  \ | /__` /  ` /  \ |  | |\ |  |  /__`
 *    |__/ |___ /~~\ |___ .__/    /~~\ | \| |__/    |__/ | .__/ \__, \__/ \__/ | \|  |  .__/
 */
CREATE SEQUENCE IF NOT EXISTS public.table_food_prices_seq;

CREATE TABLE IF NOT EXISTS public.table_food_prices
(
    dimension_key integer NOT NULL,
    food_item character varying(256) COLLATE pg_catalog."default" NOT NULL,
    brand character varying(124) COLLATE pg_catalog."default",
    store character varying(64) COLLATE pg_catalog."default",
    main_macro character varying(32) COLLATE pg_catalog."default" NOT NULL,
    kcal_amount numeric(4,0) NOT NULL,
    weight numeric(5,0) NOT NULL,
    price numeric(5,2) NOT NULL,
    last_update date,
	effective_date date NOT NULL,
	expiration_date date NOT NULL,
    CONSTRAINT "food_prices_pkey" PRIMARY KEY (dimension_key, effective_date)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public.table_food_prices
    OWNER to fiscalismia_api;
COMMENT ON TABLE public.table_food_prices IS 'contains individual food items, the store they are sold in, the macro they belong to, price and caloric information. A last_update flag indicated the date where prices were last confirmed.';

CREATE TABLE IF NOT EXISTS public.food_price_discounts
(
	food_prices_dimension_key integer NOT NULL,
    discount_price numeric(5,2) NOT NULL,
	discount_start_date date NOT NULL,
	discount_end_date date NOT NULL,
    CONSTRAINT "food_price_discounts_pkey" PRIMARY KEY (food_prices_dimension_key, discount_start_date)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public.food_price_discounts
    OWNER to fiscalismia_api;
COMMENT ON TABLE public.food_price_discounts IS 'contains the discount price, start date and end date of food items referenced dimension_key only in order to be applicable to all effective_dates within food_prices.';

CREATE TABLE IF NOT EXISTS public.food_price_image_location
(
	food_prices_dimension_key integer NOT NULL,
    filepath character varying(256) COLLATE pg_catalog."default",
    CONSTRAINT "food_price_filepaths_pkey" PRIMARY KEY (food_prices_dimension_key)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public.food_price_image_location
    OWNER to fiscalismia_api;
COMMENT ON TABLE public.food_price_discounts IS 'contains the relative filepath on the server to user uploaded food item images.';

CREATE OR REPLACE VIEW public.v_food_price_overview
 AS
 SELECT food.dimension_key AS id,
    food.food_item,
    food.brand,
    food.store,
    food.main_macro,
    food.kcal_amount,
    food.weight,
    food.price,
    food.last_update,
    food.effective_date,
    food.expiration_date,
    discounts.discount_price,
    food.price - discounts.discount_price AS reduced_by_amount,
    round((food.price - discounts.discount_price) / food.price, 2) * 100::numeric AS reduced_by_pct,
    discounts.discount_start_date,
    discounts.discount_end_date,
    discounts.discount_start_date - CURRENT_DATE AS starts_in_days,
    discounts.discount_end_date - CURRENT_DATE AS ends_in_days,
    discounts.discount_end_date - discounts.discount_start_date AS discount_days_duration,
    round(100::numeric / food.kcal_amount * 100::numeric, 2) AS weight_per_100_kcal,
    round(1000::numeric / food.weight * food.price, 2) AS price_per_kg,
    round(100::numeric / food.kcal_amount * 100::numeric / food.weight * food.price * 35::numeric, 2) AS normalized_price,
    filepaths.filepath
   FROM table_food_prices food
     LEFT JOIN food_price_discounts discounts ON food.dimension_key = discounts.food_prices_dimension_key
     LEFT JOIN food_price_image_location filepaths ON food.dimension_key = filepaths.food_prices_dimension_key;

ALTER TABLE public.v_food_price_overview
    OWNER TO fiscalismia_api;
COMMENT ON VIEW public.v_food_price_overview
    IS 'synthesized information for displaying food prices, discounts and derived calculations to frontend user';

/*               __          __        ___     ___      __   ___       __   ___  __
 *    \  /  /\  |__) |  /\  |__) |    |__     |__  \_/ |__) |__  |\ | /__` |__  /__`
 *     \/  /~~\ |  \ | /~~\ |__) |___ |___    |___ / \ |    |___ | \| .__/ |___ .__/
 */

CREATE TABLE public.category
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.category OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS public.category ADD CONSTRAINT uk_category UNIQUE (description);
COMMENT ON TABLE public.category IS 'contains variable_expenses categories such as Groceries, Leisure, Work and Travel';

CREATE TABLE public.store
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    is_online boolean DEFAULT FALSE,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.store OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS public.store ADD CONSTRAINT uk_store UNIQUE (description);
COMMENT ON TABLE public.store IS 'contains variable_expenses stores such as Lidl, Amazon and generic Cafes';

CREATE TABLE public.sensitivity
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    severity_rating smallint,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.sensitivity OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS public.sensitivity ADD CONSTRAINT uk_sensitivity UNIQUE (description);
COMMENT ON TABLE public.sensitivity IS 'contains variable_expenses food allergies and sensitivities that are typically bought as an indulgence despite being detrimental to my health';

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
COMMENT ON TABLE public.bridge_var_exp_sensitivity IS 'links variable expenses to sensitivities as this is a m:n relationship';

TRUNCATE TABLE staging.staging_variable_bills;
TRUNCATE TABLE public.test_table;
TRUNCATE TABLE public.bridge_var_exp_sensitivity;
TRUNCATE TABLE public.sensitivity CASCADE;
TRUNCATE TABLE public.variable_expenses CASCADE;
TRUNCATE TABLE public.store CASCADE;
TRUNCATE TABLE public.category CASCADE;

/* ___ ___          __   __   __   __   ___  __   __
  |__   |  |       |__) |__) /  \ /  ` |__  /__` /__`
  |___  |  |___    |    |  \ \__/ \__, |___ .__/ .__/ */
TRUNCATE TABLE staging.staging_variable_bills;
--  >>>>>!! GET INSERT STATEMENTS VIA POST REQUEST TO /api/fiscalismia/json/variable_expenses !!<<<<<<
--  >>>>>!! INSERT THESE VIA PGADMIN OR OTHER CLIENT WITH PROPER ENCODING AND NOT CMD !!<<<<<<

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
commit;