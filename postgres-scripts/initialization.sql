-- psql -U postgres
-- PW
CREATE ROLE fiscalismia_api WITH
	LOGIN
	NOSUPERUSER
	CREATEDB
	NOCREATEROLE
	NOINHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	PASSWORD 'PLACEHOLDER';

-- \q
-- psql -U fiscalismia_api -d postgres
-- PW

CREATE DATABASE fiscalismia
    WITH
    OWNER = fiscalismia_api
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
COMMENT ON DATABASE fiscalismia IS 'db for the fiscalismia webservice';

-- \c fiscalismia
-- Sie sind jetzt verbunden mit der Datenbank »fiscalismia« als Benutzer »fiscalismia_api«.
-- in Zukunft dann > psql -U fiscalismia_api -d fiscalismia


--   __   __   ___      ___  ___    ___       __        ___     __  ___      ___  ___        ___      ___  __
--  /  ` |__) |__   /\   |  |__      |   /\  |__) |    |__     /__`  |   /\   |  |__   |\/| |__  |\ |  |  /__`
--  \__, |  \ |___ /~~\  |  |___     |  /~~\ |__) |___ |___    .__/  |  /~~\  |  |___  |  | |___ | \|  |  .__/
DROP TABLE IF EXISTS public.link_var_exp_sensitivity;
DROP TABLE IF EXISTS public.variable_expenses;
DROP TABLE IF EXISTS public.category;
DROP TABLE IF EXISTS public.store;
DROP TABLE IF EXISTS public.sensitivity;

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
    severity_rating smallint NOT NULL,
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
    edible_pct_estimate numeric(5,2),
    calories_estimate smallint,
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

CREATE TABLE IF NOT EXISTS public.link_var_exp_sensitivity
(
    id serial NOT NULL ,
    variable_expense_id integer NOT NULL,
    variable_expense_description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    sensitivity_id integer NOT NULL,
	sensitivity_description  character varying(100) NOT NULL,
    CONSTRAINT "link_var_exp_sensitivity_pkey" PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public.link_var_exp_sensitivity
    ADD CONSTRAINT "l_var_exp_sens_to_sens" FOREIGN KEY (sensitivity_id)
    REFERENCES public.sensitivity (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
ALTER TABLE IF EXISTS public.link_var_exp_sensitivity
    ADD CONSTRAINT "l_var_exp_sens_to_exp" FOREIGN KEY (variable_expense_id)
    REFERENCES public.variable_expenses (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;

--          __   ___  __  ___           ___  __      __  ___      ___  ___        ___      ___  __
--  | |\ | /__` |__  |__)  |     | |\ |  |  /  \    /__`  |   /\   |  |__   |\/| |__  |\ |  |  /__`
--  | | \| .__/ |___ |  \  |     | | \|  |  \__/    .__/  |  /~~\  |  |___  |  | |___ | \|  |  .__/

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
INSERT INTO public.store (description) VALUES ('dm');
INSERT INTO public.store (description) VALUES ('Rewe');
INSERT INTO public.store (description) VALUES ('Apotheke');
INSERT INTO public.store (description) VALUES ('ebl Biomarkt');
INSERT INTO public.store (description, is_online) VALUES ('Amazon', TRUE);

INSERT INTO public.sensitivity (description, severity_rating) VALUES ('Caffeine', 1);
INSERT INTO public.sensitivity (description, severity_rating) VALUES ('Alcohol', 2);
INSERT INTO public.sensitivity (description, severity_rating) VALUES ('Aspartame/Saccharin', 2);
INSERT INTO public.sensitivity (description, severity_rating) VALUES ('Nightshade', 2);
INSERT INTO public.sensitivity (description, severity_rating) VALUES ('Cow''s milk product', 4);
INSERT INTO public.sensitivity (description, severity_rating) VALUES ('Citrus fruit', 5);
INSERT INTO public.sensitivity (description, severity_rating) VALUES ('Soy product', 5);

INSERT INTO public.variable_expenses (description, category_id, store_id, cost, purchasing_date, is_planned, contains_indulgence, edible_pct_estimate, calories_estimate)
    VALUES (
        'Salat, Energy Zero, Putenbrust',
        (SELECT id FROM category WHERE description = 'Groceries'),
        (SELECT id FROM store WHERE description = 'Lidl'),
        11.31,
        '2022-04-20',
        TRUE,
        TRUE,
        NULL,
        NULL
    );

INSERT INTO public.link_var_exp_sensitivity (variable_expense_id, variable_expense_description, sensitivity_id, sensitivity_description) 
    VALUES (
        (SELECT id FROM variable_expenses WHERE id = 1),
        (SELECT description FROM variable_expenses WHERE id = 1),
        (SELECT id FROM sensitivity WHERE description = 'Aspartame/Saccharin'),
        (SELECT description FROM sensitivity WHERE description = 'Aspartame/Saccharin')
    );
INSERT INTO public.link_var_exp_sensitivity (variable_expense_id, variable_expense_description, sensitivity_id, sensitivity_description) 
    VALUES (
        (SELECT id FROM variable_expenses WHERE id = 1),
        (SELECT description FROM variable_expenses WHERE id = 1),
        (SELECT id FROM sensitivity WHERE description = 'Caffeine'),
        (SELECT description FROM sensitivity WHERE description = 'Caffeine')
    );