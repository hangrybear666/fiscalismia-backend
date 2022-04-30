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


CREATE TABLE public."CATEGORY"
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public."CATEGORY" OWNER to fiscalismia_api;

CREATE TABLE public."STORE"
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    is_online boolean DEFAULT FALSE,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public."STORE" OWNER to fiscalismia_api;

CREATE TABLE public."SENSITIVITY"
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    severity_rating smallint NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public."SENSITIVITY" OWNER to fiscalismia_api;

CREATE TABLE IF NOT EXISTS public."VARIABLE_EXPENSES"
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
    CONSTRAINT "VARIABLE_EXPENSES_pkey" PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public."VARIABLE_EXPENSES" OWNER to fiscalismia_api;
COMMENT ON TABLE public."VARIABLE_EXPENSES" IS 'contains daily expenses such as groceries, purchases for leisure time, health and medical expenses';
ALTER TABLE IF EXISTS public."VARIABLE_EXPENSES"
    ADD CONSTRAINT "VAR_EXP_CAT" FOREIGN KEY (category_id)
    REFERENCES public."CATEGORY" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
ALTER TABLE IF EXISTS public."VARIABLE_EXPENSES"
    ADD CONSTRAINT "VAR_EXP_STORE" FOREIGN KEY (store_id)
    REFERENCES public."STORE" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;

CREATE TABLE IF NOT EXISTS public."LINK_VAR_EXP_SENSITIVITY"
(
    id serial NOT NULL ,
    variable_expense_id integer NOT NULL,
    variable_expense_description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    sensitivity_id integer NOT NULL,
		sensitivity_description  character varying(100) NOT NULL,
    CONSTRAINT "LINK_VAR_EXP_SENSITIVITY_pkey" PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public."LINK_VAR_EXP_SENSITIVITY"
    ADD CONSTRAINT "L_VAR_EXP_SENS_TO_SENS" FOREIGN KEY (sensitivity_id)
    REFERENCES public."SENSITIVITY" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
ALTER TABLE IF EXISTS public."LINK_VAR_EXP_SENSITIVITY"
    ADD CONSTRAINT "L_VAR_EXP_SENS_TO_EXP" FOREIGN KEY (variable_expense_id)
    REFERENCES public."VARIABLE_EXPENSES" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;