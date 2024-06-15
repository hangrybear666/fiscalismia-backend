-- setup NEON with database tempdb and role temprole
psql -h pg.neon.tech

/*    __                  __  ___  __       ___    __                __   ___  __    |    __   __   __  ___  __   __   ___  __
 /\  |  \  |\/| | |\ | | /__`  |  |__)  /\   |  | /  \ |\ |    |  | /__` |__  |__)   |   |__) /  \ /__`  |  / _` |__) |__  /__`
/~~\ |__/  |  | | | \| | .__/  |  |  \ /~~\  |  | \__/ | \|    \__/ .__/ |___ |  \   |   |    \__/ .__/  |  \__> |  \ |___ .__/
*/
SET client_encoding TO 'UTF8';
DROP DATABASE IF EXISTS fiscalismia;
DROP ROLE IF EXISTS fiscalismia_api;
CREATE ROLE fiscalismia_api WITH
	LOGIN
	CREATEDB
	NOCREATEROLE
	NOINHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
    -- INSERT PW HERE
	PASSWORD --'env.NEON_PGPASSWORD'
    ;
GRANT fiscalismia_api to "temprole";
DROP DATABASE IF EXISTS fiscalismia;
CREATE DATABASE fiscalismia
    WITH
    OWNER = fiscalismia_api
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
COMMENT ON DATABASE fiscalismia IS 'db for the fiscalismia webservice';