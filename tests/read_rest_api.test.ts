import supertest from 'supertest';
require('dotenv').config();
import { app } from '../src/app';
const logger = require('../src/utils/logger');

/*    __   __                          __          __        ___  __
|    /  \ /  `  /\  |       \  /  /\  |__) |  /\  |__) |    |__  /__`
|___ \__/ \__, /~~\ |___     \/  /~~\ |  \ | /~~\ |__) |___ |___ .__/*/

const ROOT_URL = '/api/fiscalismia';
let authToken: string = '';
let testTableId: number;
const currentDate = new Date();
const currentTime = currentDate.getHours() + ':' + currentDate.getMinutes() + 'and ' + currentDate.getSeconds() + 's';

/* __        __     __      __   ___       __      __   __   ___  __       ___    __        __
  |__)  /\  /__` | /  `    |__) |__   /\  |  \    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
  |__) /~~\ .__/ | \__,    |  \ |___ /~~\ |__/    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/  */

describe('supertest REST API testing basic ops', () => {
  test('READ fiscalismia root w/o authentication fails', (done) => {
    supertest(app)
      .get(ROOT_URL)
      .expect(401)
      .expect((res: supertest.Response) => {
        res.body.data = 'User not authenticated due to missing token.';
      })
      .end((err: unknown, _res: supertest.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('LOGIN with wrong credentials fails', (done) => {
    supertest(app)
      .post(`${ROOT_URL}/um/login`)
      .send({
        username: 'admin',
        email: 'herpderp@gmail.com'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .expect((res) => {
        res.body.error.message === 'username and/or password not provided in request.body';
      })
      .end((err: unknown, _res: supertest.Response) => {
        if (err instanceof Error) return done(err);
        return done();
      });
  });

  test('LOGIN with correct credentials succeeds', (done) => {
    const t1 = process.env.ADMIN_USER_PW?.toString().length;
    const t2 = process.env.DB_CONNECTION_URL?.toString().length;
    const t3 = process.env.JWT_SECRET?.toString().length;
    console.log(t1);
    console.log(t2);
    console.log(t3);
    supertest(app)
      .post(`${ROOT_URL}/um/login`)
      .send({
        username: 'admin',
        password: process.env.ADMIN_USER_PW
      })
      .expect(function (res: supertest.Response) {
        console.log('type ' + res.type);
        console.log('body:');
        console.log(JSON.stringify(res.body, null, 2));
        console.log(res);
      })
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err: unknown, res: supertest.Response) => {
        console.log(res);
        if (err instanceof Error) {
          logger.error(err);
          return done(err);
        }
        // set local authentication token variable to text of login response
        authToken = res.text;
        console.log(authToken);
        return done();
      });
  });

  test('POST description into Test Table', (done) => {
    supertest(app)
      .post(`${ROOT_URL}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .send({
        description: 'Inserted from Supertest [read_rest_api.test.js] at [' + currentTime + ']'
      })
      .expect(201)
      .end((err: unknown, _res: supertest.Response) => {
        if (err instanceof Error) return done(err);
        // set local authentication token variable to text of login response
        return done();
      });
  });

  test('READ ID and description from Test Table', (done) => {
    supertest(app)
      .get(`${ROOT_URL}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: unknown, res: supertest.Response) => {
        if (err instanceof Error) return done(err);
        // set max id (which is the one just inserted via post) for update and delete
        const idsDescending = res.body.results
          .map((e: any) => e.id)
          .sort((a: string, b: string) => parseInt(b) - parseInt(a));
        testTableId = idsDescending[0];
        return done();
      });
  });
  test(`UPDATE Test Table at ID /${testTableId}`, (done) => {
    supertest(app)
      .put(`${ROOT_URL}/${testTableId}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect('Content-Type', /json/)
      .send({
        description: 'Updated from Supertest [read_rest_api.test.js] at [' + currentTime + ']'
      })
      .expect(200)
      .end((err: unknown, res: supertest.Response) => {
        if (err instanceof Error) {
          logger.debug(JSON.stringify(res));
          logger.debug(res);
          console.log(JSON.stringify(res));
          return done(err);
        }
        return done();
      });
  });
  /*
  test("Delete from Test Table at /:id", (done) => {
    request(app)
      .delete(`/1`)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.data.length = 1;
        res.body.data[0].email = "test@example.com";
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
   */
});
