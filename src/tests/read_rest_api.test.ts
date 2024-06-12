import request from 'supertest';
require('dotenv').config();
import { app } from '../app';
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

describe('supertest REST API testing basic ops', () => {
  let maxTestTableId: number;
  let insertedId: number;
  const username = 'admin';

  test('AUTH read fiscalismia root w/o authentication fails', (done) => {
    request(app)
      .get(ROOT_URL)
      .expect(401)
      .expect((res: request.Response) => {
        res.body.data = 'User not authenticated due to missing token.';
      })
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
        password: process.env.ADMIN_USER_PW
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

  test('POST test_table', (done) => {
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

  test('GET test_taböe', (done) => {
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

  test('UPDATE test_table', (done) => {
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

  test('DELETE test_table', (done) => {
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

  // test('GET investments by ID', (done) => {
  //   getRequestByRandomIdMatches(done, '/investments');
  // });

  // test('GET investment_dividends by ID', (done) => {
  //   getRequestByRandomIdMatches(done, '/investment_dividends');
  // });

  // test('GET food_prices_and_discounts by ID', (done) => {
  //   getRequestByRandomIdMatches(done, '/food_prices_and_discounts');
  // });

  // test('GET discounted_foods_current by ID', (done) => {
  //   getRequestByRandomIdMatches(done, '/discounted_foods_current');
  // });
});

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
