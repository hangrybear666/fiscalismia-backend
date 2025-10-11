/*      __                  __  ___  __       ___    __                __   ___  __    |    ___    __   __               __                         __
   /\  |  \  |\/| | |\ | | /__`  |  |__)  /\   |  | /  \ |\ |    |  | /__` |__  |__)   |   |__  | /__` /  `  /\  |    | /__`  |\/| |  /\       /\  |__) |
  /~~\ |__/  |  | | | \| | .__/  |  |  \ /~~\  |  | \__/ | \|    \__/ .__/ |___ |  \   |   |    | .__/ \__, /~~\ |___ | .__/  |  | | /~~\ ___ /~~\ |    | */

-- connect as fiscalismia by e.g. calling psql -c "\c fiscalismia"
SET client_encoding TO 'UTF8';
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA IF NOT EXISTS public AUTHORIZATION fiscalismia_api;
COMMENT ON SCHEMA public IS 'standard public schema containing data accessible from all other schematas';
GRANT ALL ON SCHEMA public TO PUBLIC;
GRANT ALL ON SCHEMA public TO fiscalismia_api;

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
-- pg_catalog is automatically added silently to the search_path and thus available in all schemas
CREATE EXTENSION pgcrypto SCHEMA "public";
CREATE EXTENSION citext SCHEMA "public";

/* __   __   ___      ___  ___    ___       __        ___     __  ___      ___  ___        ___      ___  __
  /  ` |__) |__   /\   |  |__      |   /\  |__) |    |__     /__`  |   /\   |  |__   |\/| |__  |\ |  |  /__`
  \__, |  \ |___ /~~\  |  |___     |  /~~\ |__) |___ |___    .__/  |  /~~\  |  |___  |  | |___ | \|  |  .__/
  */

-- USER MGMT
DROP TABLE IF EXISTS public.um_user_settings;
DROP TABLE IF EXISTS public.um_users;

/*      __   ___  __                           __   ___        ___      ___
  |  | /__` |__  |__)     |\/|  /\  |\ |  /\  / _` |__   |\/| |__  |\ |  |
  \__/ .__/ |___ |  \     |  | /~~\ | \| /~~\ \__> |___  |  | |___ | \|  |
*/
CREATE TABLE IF NOT EXISTS public.um_users (
	id serial NOT NULL,
  	username character varying(255) NOT NULL UNIQUE,
    email citext NOT NULL UNIQUE,
    schema character varying(255) NOT NULL UNIQUE,
  	password TEXT NOT NULL,
	PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.um_users
    OWNER to fiscalismia_api;

CREATE TABLE IF NOT EXISTS public.um_user_settings (
	user_id integer NOT NULL,
  	setting_key character varying(64) COLLATE pg_catalog."default",
	setting_value character varying(128) COLLATE pg_catalog."default",
	setting_description character varying(512) COLLATE pg_catalog."default"
);
ALTER TABLE IF EXISTS public.um_user_settings
    OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS public.um_user_settings ADD CONSTRAINT uk_user_settings UNIQUE (user_id, setting_key);
ALTER TABLE IF EXISTS public.um_user_settings
    ADD CONSTRAINT "fk_settings_user" FOREIGN KEY (user_id)
    REFERENCES public.um_users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
COMMENT ON TABLE public.um_user_settings IS 'contains user-specific settings such as selected theme and palette';