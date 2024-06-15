import request from 'supertest';
require('dotenv').config();
import { app } from '../app';
import { UserSettingObject } from '../utils/customTypes';
const logger = require('../utils/logger');

/*    __   __                          __          __        ___  __
|    /  \ /  `  /\  |       \  /  /\  |__) |  /\  |__) |    |__  /__`
|___ \__/ \__, /~~\ |___     \/  /~~\ |  \ | /~~\ |__) |___ |___ .__/*/

const ROOT_URL = '/api/fiscalismia';
let authToken: string = '';
const currentDate = new Date();
const currentTime = currentDate.getHours() + ':' + currentDate.getMinutes() + 'and ' + currentDate.getSeconds() + 's';
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
const day = String(currentDate.getDate()).padStart(2, '0');
const dbDateStr = `${year}-${month}-${day}`;
/* __        __     __      __   ___       __      __   __   ___  __       ___    __        __
  |__)  /\  /__` | /  `    |__) |__   /\  |  \    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
  |__) /~~\ .__/ | \__,    |  \ |___ /~~\ |__/    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/  */

describe('supertest REST API testing entire REST functionality', () => {
  let maxTestTableId: number;
  let insertedId: number;
  const insertedFoodItemIds: number[] = [];
  const username = 'admin';

  test('AUTH read fiscalismia root w/o authentication fails', (done) => {
    request(app)
      .get(ROOT_URL)
      .expect(401)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH login w/o pswd fails', (done) => {
    request(app)
      .post(`${ROOT_URL}/um/login`)
      .send({
        username: 'admin',
        email: 'herpderp@gmail.com'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH login with wrong pswd fails', (done) => {
    request(app)
      .post(`${ROOT_URL}/um/login`)
      .send({
        username: 'admin',
        password: 'kjlfaeijoawfe'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH login /w correct credentials succeeds', (done) => {
    request(app)
      .post(`${ROOT_URL}/um/login`)
      .send({
        username: 'admin',
        password: 'changeit'
      })
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) {
          logger.error(err);
          return done(err);
        }
        // set local authentication token variable to text of login response
        authToken = res.text;
        return done();
      });
  });

  test('AUTH create user with missing username returns 400 Bad Request', (done) => {
    request(app)
      .post(`${ROOT_URL}/um/credentials`)
      .send({
        username: '',
        email: 'randomuser@randomdomain.com',
        password: 'testcredential'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create user with missing email returns 400 Bad Request', (done) => {
    request(app)
      .post(`${ROOT_URL}/um/credentials`)
      .send({
        username: 'randomUser',
        password: 'testcredential'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create user with missing password returns 400 Bad Request', (done) => {
    request(app)
      .post(`${ROOT_URL}/um/credentials`)
      .send({
        username: 'randomUser',
        email: 'randomuser@randomdomain.com'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create user not whitelisted returns 403 Forbidden', (done) => {
    request(app)
      .post(`${ROOT_URL}/um/credentials`)
      .send({
        username: 'randomUser',
        email: 'randomuser@randomdomain.com',
        password: 'testcredential'
      })
      .expect('Content-Type', /json/)
      .expect(403)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create user /w invalid username returns 422 Unprocessable Content', (done) => {
    request(app)
      .post(`${ROOT_URL}/um/credentials`)
      .send({
        username: '\\**+?!#',
        email: 'randomuser@randomdomain.com',
        password: 'testcredential'
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create user /w invalid email returns 422 Unprocessable Content', (done) => {
    request(app)
      .post(`${ROOT_URL}/um/credentials`)
      .send({
        username: 'randomUser',
        email: 'ʕ•ᴥ•ʔ@.com',
        password: 'testcredential'
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('AUTH create user /w invalid pswd returns 422 Unprocessable Content', (done) => {
    request(app)
      .post(`${ROOT_URL}/um/credentials`)
      .send({
        username: 'randomUser',
        email: 'randomuser@randomdomain.com',
        password: 'ʕ•ᴥ•ʔ'
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('POST into test_table', (done) => {
    request(app)
      .post(`${ROOT_URL}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .send({
        description: 'Inserted from Supertest [read_rest_api.test.js] at [' + currentTime + ']'
      })
      .expect(201)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
        insertedId = Number(res.body.results[0].id);
        return done();
      });
  });

  test('GET from test_taböe', (done) => {
    request(app)
      .get(`${ROOT_URL}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        // set max id (which is the one just inserted via post) for update and delete
        const idsDescending = res.body.results.map((e: any) => Number(e.id)).sort((a: number, b: number) => b - a);
        maxTestTableId = idsDescending[0];
        expect(maxTestTableId).toEqual(insertedId);
        return done();
      });
  });

  test('UPDATE in test_table', (done) => {
    const updatedDescription = 'Updated from Supertest [read_rest_api.test.js] at [' + currentTime + ']';
    request(app)
      .put(`${ROOT_URL}/${maxTestTableId}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .send({
        description: updatedDescription
      })
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) {
          return done(err);
        }
        expect(res.body.results).toBeDefined();
        expect(res.body.results[0].description?.length).toBeGreaterThan(0);
        const returnedDescriptiion = res.body.results[0].description;
        expect(updatedDescription).toEqual(returnedDescriptiion);
        return done();
      });
  });

  test('DELETE from test_table', (done) => {
    request(app)
      .delete(`${ROOT_URL}/${insertedId}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) {
          return done(err);
        }
        expect(res.body.results).toBeDefined();
        expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
        const deletedId = Number(res.body.results[0].id);
        expect(deletedId).toEqual(insertedId);
        return done();
      });
  });

  test('GET um_user_settings [admin]', (done) => {
    getRequestReturnsResult(done, `/um/settings/${username}`);
  });

  test('GET category', (done) => {
    getRequestReturnsResult(done, '/category');
  });

  test('GET store', (done) => {
    getRequestReturnsResult(done, '/store');
  });

  test('GET sensitivity', (done) => {
    getRequestReturnsResult(done, '/sensitivity');
  });

  test('GET variable_expenses', (done) => {
    getRequestReturnsResult(done, '/variable_expenses');
  });

  test('GET investments', (done) => {
    getRequestReturnsResult(done, '/investments');
  });

  test('GET investment_dividends', (done) => {
    getRequestReturnsResult(done, '/investment_dividends');
  });

  test('GET fixed_costs', (done) => {
    getRequestReturnsResult(done, '/fixed_costs');
  });

  test('GET fixed_income', (done) => {
    getRequestReturnsResult(done, '/fixed_income');
  });

  test('GET food_prices_and_discounts', (done) => {
    getRequestReturnsResult(done, '/food_prices_and_discounts');
  });

  test('GET discounted_foods_current', (done) => {
    getRequestReturnsResult(done, '/discounted_foods_current');
  });

  test('GET sensitivities_of_purchase', (done) => {
    getRequestReturnsResult(done, '/sensitivities_of_purchase');
  });

  test('GET category by ID', (done) => {
    getRequestByRandomIdMatches(done, '/category');
  });

  test('GET store by ID', (done) => {
    getRequestByRandomIdMatches(done, '/store');
  });

  test('GET sensitivity by ID', (done) => {
    getRequestByRandomIdMatches(done, '/sensitivity');
  });

  test('GET variable_expenses by ID', (done) => {
    getRequestByRandomIdMatches(done, '/variable_expenses');
  });

  test('GET fixed_costs by ID', (done) => {
    getRequestByRandomIdMatches(done, '/fixed_costs');
  });

  /**
   * since the all query and specific query use different database fields (id | sensitivity_id) we need a specific implementation
   */
  test('GET sensitivities_of_purchase by sensitivity_id', (done) => {
    request(app)
      //   __        ___  __
      //  /  \ |  | |__  |__) \ /     /\  |    |
      //  \__X \__/ |___ |  \  |     /~~\ |___ |___
      .get(`${ROOT_URL}/sensitivities_of_purchase`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results.length).toBeGreaterThan(0);
        const randomId = res.body.results[Math.floor(Math.random() * res.body.results.length)].sensitivity_id;
        request(app)
          //   __        ___  __          __   __   ___  __     ___    __      ___      ___  __
          //  /  \ |  | |__  |__) \ /    /__` |__) |__  /  ` | |__  | /  `    |__  |\ |  |  |__) \ /
          //  \__X \__/ |___ |  \  |     .__/ |    |___ \__, | |    | \__,    |___ | \|  |  |  \  |
          .get(`${ROOT_URL}/sensitivities_of_purchase/sensitivity/${randomId}`)
          .set('Authorization', 'Bearer ' + authToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err: unknown, res: request.Response) => {
            if (err instanceof Error) return done(err);
            expect(res.body.results).toBeDefined();
            expect(res.body.results.length).toBeGreaterThan(0);
            const returnedId = res.body.results[0].sensitivity_id;
            expect(returnedId).toEqual(randomId);
            return done();
          });
      });
  });

  /**
   * since the all query and specific query use different database fields (id | variable_expense_id) we need a specific implementation
   */
  test('GET sensitivities_of_purchase by variable_expense_id', (done) => {
    request(app)
      //   __        ___  __
      //  /  \ |  | |__  |__) \ /     /\  |    |
      //  \__X \__/ |___ |  \  |     /~~\ |___ |___
      .get(`${ROOT_URL}/sensitivities_of_purchase`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results.length).toBeGreaterThan(0);
        const randomId = res.body.results[Math.floor(Math.random() * res.body.results.length)].variable_expense_id;
        request(app)
          //   __        ___  __          __   __   ___  __     ___    __      ___      ___  __
          //  /  \ |  | |__  |__) \ /    /__` |__) |__  /  ` | |__  | /  `    |__  |\ |  |  |__) \ /
          //  \__X \__/ |___ |  \  |     .__/ |    |___ \__, | |    | \__,    |___ | \|  |  |  \  |
          .get(`${ROOT_URL}/sensitivities_of_purchase/var_expense/${randomId}`)
          .set('Authorization', 'Bearer ' + authToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err: unknown, res: request.Response) => {
            if (err instanceof Error) return done(err);
            expect(res.body.results).toBeDefined();
            expect(res.body.results.length).toBeGreaterThan(0);
            const returnedId = res.body.results[0].variable_expense_id;
            expect(returnedId).toEqual(randomId);
            return done();
          });
      });
  });

  /**
   * Queries variable expenses by given Category. The Category is randomized between test runs to guarantee the data is sound.
   */
  test('GET variable_expenses by random category', (done) => {
    const VAR_EXPENSE_CATEGORIES = ['Groceries', 'Leisure', 'Sale', 'Hygiene', 'Gift'];
    request(app)
      .get(
        `${ROOT_URL}/variable_expenses/category/${VAR_EXPENSE_CATEGORIES[Math.floor(Math.random() * VAR_EXPENSE_CATEGORIES.length)]}`
      )
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results.length).toBeGreaterThan(0);
        return done();
      });
  });

  /**
   * get specific set collection of fixed income by date in the format 'yyyy-mm-dd'
   */
  test('GET fixed_income by effective_date', (done) => {
    request(app)
      .get(`${ROOT_URL}/fixed_income/valid/${dbDateStr}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results.length).toBeGreaterThan(0);
        return done();
      });
  });

  /**
   * get specific set collection of fixed costs by date in the format 'yyyy-mm-dd'
   */
  test('GET fixed_costs by effective_date', (done) => {
    request(app)
      .get(`${ROOT_URL}/fixed_costs/valid/${dbDateStr}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results.length).toBeGreaterThan(0);
        return done();
      });
  });

  test('GET investments by ID', (done) => {
    getRequestByRandomIdMatches(done, '/investments');
  });

  test('GET investment_dividends by ID', (done) => {
    getRequestByRandomIdMatches(done, '/investment_dividends');
  });

  test('POST user_settings: set dark mode for admin user', (done) => {
    const userSettings: UserSettingObject = {
      username: username,
      settingKey: 'selected_mode',
      settingValue: 'dark'
    };
    request(app)
      .post(`${ROOT_URL}/um/settings`)
      .send(userSettings)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(201) // Created
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(res.body.results[0].username).toEqual(username);
        return done();
      });
  });

  test('POST user_settings: providing invalid username fails with 422 Unprocessable Content', (done) => {
    const userSettings: UserSettingObject = {
      username: '/(´ß!#',
      settingKey: 'selected_mode',
      settingValue: 'dark'
    };
    request(app)
      .post(`${ROOT_URL}/um/settings`)
      .send(userSettings)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(422)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('POST user_settings: providing wrong setting_key fails', (done) => {
    const userSettings: UserSettingObject = {
      username: 'admin',
      settingKey: 'not_defined',
      settingValue: 'dark'
    };
    request(app)
      .post(`${ROOT_URL}/um/settings`)
      .send(userSettings)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('POST user_settings: providing not existing username fails', (done) => {
    const userSettings: UserSettingObject = {
      username: 'notExistingUser',
      settingKey: 'selected_mode',
      settingValue: 'light'
    };
    request(app)
      .post(`${ROOT_URL}/um/settings`)
      .send(userSettings)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: unknown, _res: request.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  /**
    _____ ______     __     ___ _   _ ____  _____ ____ _____ ___ ___  _   _
   |_   _/ ___\ \   / /    |_ _| \ | / ___|| ____|  _ \_   _|_ _/ _ \| \ | |
     | | \___ \\ \ / /      | ||  \| \___ \|  _| | |_) || |  | | | | |  \| |
     | |  ___) |\ V /       | || |\  |___) | |___|  _ < | |  | | |_| | |\  |
     |_| |____/  \_/       |___|_| \_|____/|_____|_| \_\|_| |___\___/|_| \_|*/

  // variable expenses
  test('POST TSV data: variable_expenses and receive inserts', (done) => {
    const textTsv = `description	category	store	cost	purchasing_date	is_planned	contains_indulgence	sensitivities
  Softdrinks	Groceries	Edeka	€2.48	 28.04.2022	N	J	caffeine, aspartame/saccharin`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/variable_expenses', textTsv, false);
  });

  test('POST TSV data: variable_expenses /w extra column and expect 400 Bad Request', (done) => {
    const textTsv = `description	category	store	cost	purchasing_date	is_planned	contains_indulgence	sensitivities	extra_column
  Softdrinks	Groceries	Edeka	€2.48	 28.04.2022	N	J	caffeine, aspartame/saccharin`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/variable_expenses', textTsv, true);
  });

  test('POST TSV data: variable_expenses /w empty tsv and expect 400 Bad Request', (done) => {
    postTsvAndReceiveInsertStmt(done, '/texttsv/variable_expenses', '', true);
  });

  // fixed costs
  test('POST TSV data: fixed_costs and receive inserts', (done) => {
    const textTsv = `category	description	monthly_interval	billed_cost	monthly_cost	effective_date	expiration_date
    LIVING_ESSENTIALS 	Miete	1	360	360.00	01.06.2023	31.08.2023`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/fixed_costs', textTsv, false);
  });

  test('POST TSV data: fixed_costs /w extra column and expect 400 Bad Request', (done) => {
    const textTsv = `category	description	monthly_interval	billed_cost	monthly_cost	effective_date	expiration_date	extra_column
    LIVING_ESSENTIALS 	Miete	1	360	360.00	01.06.2023	31.08.2023`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/fixed_costs', textTsv, true);
  });

  test('POST TSV data: fixed_costs /w empty tsv and expect 400 Bad Request', (done) => {
    postTsvAndReceiveInsertStmt(done, '/texttsv/fixed_costs', '', true);
  });

  // fixed income
  test('POST TSV data: fixed_income and receive inserts', (done) => {
    const textTsv = `description	type	monthly_interval	value	effective_date	expiration_date
    Example Job Monthly Salary	net salary	1	3132.04	01.01.2024	01.01.4000`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/fixed_income', textTsv, false);
  });

  test('POST TSV data: fixed_income /w extra column and expect 400 Bad Request', (done) => {
    const textTsv = `description	type	monthly_interval	value	effective_date	expiration_date	extra_column
    Example Job Monthly Salary	net salary	1	3132.04	01.01.2024	01.01.4000`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/fixed_income', textTsv, true);
  });

  test('POST TSV data: fixed_income /w empty tsv and expect 400 Bad Request', (done) => {
    postTsvAndReceiveInsertStmt(done, '/texttsv/fixed_income', '', true);
  });

  // new food items
  test('POST TSV data: new_food_items and receive inserts', (done) => {
    const textTsv = `food_item	brand	store	main_macro	kcal_amount	weight	price	last_update
    Oatly Cuisine 15%	Oatly	Alle	Fat	150	250	1.29	 31.07.2023`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/new_food_items', textTsv, false);
  });

  test('POST TSV data: new_food_items /w extra column and expect 400 Bad Request', (done) => {
    const textTsv = `food_item	brand	store	main_macro	kcal_amount	weight	price	last_update	extra_column
    Oatly Cuisine 15%	Oatly	Alle	Fat	150	250	1.29	 31.07.2023`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/new_food_items', textTsv, true);
  });

  test('POST TSV data: new_food_items /w empty tsv and expect 400 Bad Request', (done) => {
    postTsvAndReceiveInsertStmt(done, '/texttsv/new_food_items', '', true);
  });

  // investments
  test('POST TSV data: investments and receive inserts', (done) => {
    const textTsv = `execution_type	description	isin	investment_type	marketplace	units	price_per_unit	total_price	fees	execution_date	pct_of_profit_taxed	profit_amt
    buy	CD PROJEKT S.A. C ZY 1	PLOPTTC00011	stock	Stuttgart	42	24.46	1043.11	15.79	22.01.2024		`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/investments', textTsv, false);
  });

  test('POST TSV data: investments /w extra column and expect 400 Bad Request', (done) => {
    const textTsv = `execution_type	description	isin	investment_type	marketplace	units	price_per_unit	total_price	fees	execution_date	pct_of_profit_taxed	profit_amt	extra_column
    buy	CD PROJEKT S.A. C ZY 1	PLOPTTC00011	stock	Stuttgart	42	24.46	1043.11	15.79	22.01.2024		`;
    postTsvAndReceiveInsertStmt(done, '/texttsv/investments', textTsv, true);
  });

  test('POST TSV data: investments /w empty tsv and expect 400 Bad Request', (done) => {
    postTsvAndReceiveInsertStmt(done, '/texttsv/investments', '', true);
  });

  /**
    ____  ____      ____  _____ ____  ____ ___ ____ _____ ____
   |  _ \| __ )    |  _ \| ____|  _ \/ ___|_ _/ ___|_   _/ ___|
   | | | |  _ \    | |_) |  _| | |_) \___ \| |\___ \ | | \___ \
   | |_| | |_) |   |  __/| |___|  _ < ___) | | ___) || |  ___) |
   |____/|____/    |_|   |_____|_| \_\____/___|____/ |_| |____/*/

  test('POST /w db persist: new_food_item expects 201 Created', (done) => {
    const newFoodItem = {
      food_item: 'Hafermilch',
      brand: 'Oatly',
      store: 'Edeka',
      main_macro: 'Fat',
      kcal_amount: '63',
      weight: '1000',
      price: '2.39',
      last_update: new Date()
    };
    request(app)
      .post(`${ROOT_URL}/food_item`)
      .send(newFoodItem)
      .set('Authorization', 'Bearer ' + authToken)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
        insertedFoodItemIds.push(Number(res.body.results[0].id));
        return done();
      });
  });

  test('POST /w db persist: attempt to save new_food_item twice expect 400 Bad Request', (done) => {
    const newFoodItem = {
      food_item: 'Heidelbeeren TK',
      brand: 'Freshona',
      store: 'Lidl',
      main_macro: 'Carbs',
      kcal_amount: '34',
      weight: '400',
      price: '1.79',
      last_update: new Date()
    };
    request(app)
      // post valid item
      .post(`${ROOT_URL}/food_item`)
      .send(newFoodItem)
      .set('Authorization', 'Bearer ' + authToken)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err: unknown, res: request.Response) => {
        if (err instanceof Error) return done(err);
        expect(res.body.results).toBeDefined();
        expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
        insertedFoodItemIds.push(Number(res.body.results[0].id));
        request(app)
          // post item again. expect to violate unique key constraint
          .post(`${ROOT_URL}/food_item`)
          .send(newFoodItem)
          .set('Authorization', 'Bearer ' + authToken)
          .set('Content-Type', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err: unknown, _res: request.Response) => {
            if (err instanceof Error) return done(err);
            return done();
          });
      });
  });

  test('DELETE prior created food_items from db expecting ids returned', (done) => {
    const deleteRequests = insertedFoodItemIds.map((insertedId: number) => {
      return request(app)
        .delete(`${ROOT_URL}/food_item/${insertedId}`)
        .set('Authorization', 'Bearer ' + authToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res: request.Response) => {
          expect(res.body.results).toBeDefined();
          expect(!isNaN(Number(res.body.results[0].id))).toBeTruthy();
          const deletedId = Number(res.body.results[0].id);
          expect(deletedId).toEqual(insertedId);
        });
    });
    // wait for all delete requests to terminate before calling done on the test instance
    Promise.all(deleteRequests)
      .then(() => done())
      .catch((err) => done(err));
  });
});

/**
 *
 * @param {jest.DoneCallback} done
 * @param {string} relativePath
 * @param {string} exampleTsv Tab Separated Value with Raw Data Example
 * @param {boolean} expectError
 */
function postTsvAndReceiveInsertStmt(
  done: jest.DoneCallback,
  relativePath: string,
  exampleTsv: string,
  expectError: boolean
) {
  request(app)
    .post(`${ROOT_URL}${relativePath}`)
    .send(exampleTsv)
    .set('Authorization', 'Bearer ' + authToken)
    .set('Content-Type', 'text/plain')
    .expect('Content-Type', expectError ? /json/ : /html/)
    .expect(expectError ? 400 : 200)
    .end((err: unknown, res: request.Response) => {
      if (err instanceof Error) return done(err);
      if (!expectError) {
        expect(res.text).toBeDefined();
        expect(res.text.length).toBeGreaterThan(0);
        expect(res.text.split('\n')[0]).toEqual('--[1] rows transformed into [1] INSERT STATEMENTS');
      }
      return done();
    });
}

/**
 * 1) Queries all data returned by given path
 * 2) Retrieves a random ID from returned data
 * 3) Queries specific id in another route and expects IDs to match.
 * @param {jest.DoneCallback} done
 * @param {string} relativePathAll
 * @param {string} relativePathSpecific optional path for specific query, only IF it diverges from relativePathAll
 * @param {boolean} expectMultiple optional flag specifying if multiple rows are expected as a result of querying a single id
 */
function getRequestByRandomIdMatches(
  done: jest.DoneCallback,
  relativePathAll: string,
  relativePathSpecific?: string,
  expectMultiple: boolean = false
) {
  request(app)
    //   __        ___  __
    //  /  \ |  | |__  |__) \ /     /\  |    |
    //  \__X \__/ |___ |  \  |     /~~\ |___ |___
    .get(`${ROOT_URL}${relativePathAll}`)
    .set('Authorization', 'Bearer ' + authToken)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err: unknown, res: request.Response) => {
      if (err instanceof Error) return done(err);
      expect(res.body.results).toBeDefined();
      expect(res.body.results.length).toBeGreaterThan(0);
      const randomId = res.body.results[Math.floor(Math.random() * res.body.results.length)].id;
      request(app)
        //   __        ___  __          __   __   ___  __     ___    __      ___      ___  __
        //  /  \ |  | |__  |__) \ /    /__` |__) |__  /  ` | |__  | /  `    |__  |\ |  |  |__) \ /
        //  \__X \__/ |___ |  \  |     .__/ |    |___ \__, | |    | \__,    |___ | \|  |  |  \  |
        .get(`${ROOT_URL}${relativePathSpecific ? relativePathSpecific : relativePathAll}/${randomId}`)
        .set('Authorization', 'Bearer ' + authToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err: unknown, res: request.Response) => {
          if (err instanceof Error) return done(err);
          expect(res.body.results).toBeDefined();
          if (expectMultiple) {
            expect(res.body.results.length).toBeGreaterThan(0);
          } else {
            expect(res.body.results.length).toEqual(1);
          }
          const returnedId = res.body.results[0].id;
          expect(returnedId).toEqual(randomId);
          return done();
        });
    });
}

/**
 * Basic Request expecting db to return results with length > 0
 * @param done
 * @param {string} relativePath
 */
function getRequestReturnsResult(done: jest.DoneCallback, relativePath: string) {
  request(app)
    .get(`${ROOT_URL}${relativePath}`)
    .set('Authorization', 'Bearer ' + authToken)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err: unknown, res: request.Response) => {
      if (err instanceof Error) return done(err);
      expect(res.body.results).toBeDefined();
      expect(res.body.results.length).toBeGreaterThan(0);
      return done();
    });
}
