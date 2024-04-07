/*            __   ___  __  ___          __   ___  __           __   __
 *    | |\ | /__` |__  |__)  |     |  | /__` |__  |__)    |    /  \ / _` | |\ |
 *    | | \| .__/ |___ |  \  |     \__/ .__/ |___ |  \    |___ \__/ \__> | | \|
 */
\c fiscalismia
SET client_encoding TO 'UTF8';
INSERT INTO public.um_users (username, email, password) VALUES
('admin',
 'herp_derp@gmail.io',
  crypt( --'env.ADMIN_USER_PW', gen_salt('bf',12)));

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

/* ___ ___          __   __   __   __   ___  __   __
  |__   |  |       |__) |__) /  \ /  ` |__  /__` /__`
  |___  |  |___    |    |  \ \__/ \__, |___ .__/ .__/ */

TRUNCATE TABLE staging.staging_variable_bills;
TRUNCATE TABLE public.bridge_var_exp_sensitivity;
TRUNCATE TABLE public.sensitivity CASCADE;
TRUNCATE TABLE public.variable_expenses CASCADE;
TRUNCATE TABLE public.store CASCADE;
TRUNCATE TABLE public.category CASCADE;
TRUNCATE TABLE staging.staging_variable_bills;

/*     _____  _____ _____     _____ _   _  _____ ___________ _____ _____    ____________ ________  ___    _____  _____ _   _______  _____  _____    ______  ___ _____ ___
 *    |  __ \|  ___|_   _|   |_   _| \ | |/  ___|  ___| ___ \_   _/  ___|   |  ___| ___ \  _  |  \/  |   /  ___||  _  | | | | ___ \/  __ \|  ___|   |  _  \/ _ \_   _/ _ \
 *    | |  \/| |__   | |       | | |  \| |\ `--.| |__ | |_/ / | | \ `--.    | |_  | |_/ / | | | .  . |   \ `--. | | | | | | | |_/ /| /  \/| |__     | | | / /_\ \| |/ /_\ \
 *    | | __ |  __|  | |       | | | . ` | `--. \  __||    /  | |  `--. \   |  _| |    /| | | | |\/| |    `--. \| | | | | | |    / | |    |  __|    | | | |  _  || ||  _  |
 *    | |_\ \| |___  | |      _| |_| |\  |/\__/ / |___| |\ \  | | /\__/ /   | |   | |\ \\ \_/ / |  | |   /\__/ /\ \_/ / |_| | |\ \ | \__/\| |___    | |/ /| | | || || | | |
 *     \____/\____/  \_/      \___/\_| \_/\____/\____/\_| \_| \_/ \____/    \_|   \_| \_|\___/\_|  |_/   \____/  \___/ \___/\_| \_| \____/\____/    |___/ \_| |_/\_/\_| |_/
 *    VIA POST REQUEST TO /api/fiscalismia/tsv/variable_expenses using
 *       varExpensesTsv.tsv
 *       fixedCostsTsv.tsv
 *       incomeTsv.tsv
 *       newFoodItemsTsv.tsv
 *       investments.tsv
 *    INSERT THESE VIA PGADMIN OR OTHER CLIENT WITH PROPER UTF-8 ENCODING FOR UMLAUTS AND NOT CMD
 */

SELECT ETL_VARIABLE_EXPENSES();
TRUNCATE TABLE staging.staging_variable_bills;