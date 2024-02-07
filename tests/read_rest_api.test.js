const request = require("supertest");
require('dotenv').config()
const app = require("../app");
const logger = require('../utils/logger')


/*    __   __                          __          __        ___  __
|    /  \ /  `  /\  |       \  /  /\  |__) |  /\  |__) |    |__  /__`
|___ \__/ \__, /~~\ |___     \/  /~~\ |  \ | /~~\ |__) |___ |___ .__/*/

const ROOT_URL = "/api/fiscalismia"
let authToken = ''
let testTableId = null
const currentDate = new Date();
const currentTime = currentDate.getHours() + ":"
                + currentDate.getMinutes() + "and "
                + currentDate.getSeconds() + "s";


/* __        __     __      __   ___       __      __   __   ___  __       ___    __        __
  |__)  /\  /__` | /  `    |__) |__   /\  |  \    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
  |__) /~~\ .__/ | \__,    |  \ |___ /~~\ |__/    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/  */

describe("supertest REST API testing basic read operations", () => {

  test("READ fiscalismia root w/o authentication fails", (done) => {
    request(app)
        .get(ROOT_URL)
        .expect(401)
        .expect((res) => {
        res.body.data= "User not authenticated due to missing token.";
        })
        .end((err, res) => {
        if (err) return done(err);
        return done();
        });
    });


  test("LOGIN with wrong credentials fails", (done) => {
    request(app)
        .post(`${ROOT_URL}/um/login`)
        .expect("Content-Type", /json/)
        .send({
            "username": "admin",
            "email": "herpderp@gmail.com"
        })
        .expect(400)
        .expect((res) => {
            console.log("ERROR MESSAGE:")
            console.log(res.body.error.message)
            res.body.error.message=== "username and/or password not provided in request.body";
        })
        .end((err, res) => {
        if (err) return done(err);
        return done();
        });
    });


test("LOGIN with correct credentials succeeds", (done) => {
    request(app)
        .post(`${ROOT_URL}/um/login`)
        .expect("Content-Type", /html/)
        .send({
            "username": "admin",
            "password": process.env.ADMIN_PW
        })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // set local authentication token variable to text of login response
            authToken = res.text
            return done();
        });
    });

    
test("POST description into Test Table", (done) => {
    request(app)
        .post(`${ROOT_URL}`)
        .expect("Content-Type", /json/)
        .send({
            description: "Inserted from Supertest [read_rest_api.test.js] at [" + currentTime + "]",
          })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // set local authentication token variable to text of login response
            return done();
        });
    });



test("READ ID and description from Test Table", (done) => {
    request(app)
        .get(`${ROOT_URL}`)
        .set('Authorization', 'Bearer ' + authToken)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            // set max id (which is the one just inserted via post) for update and delete
            const idsDescending = res.body.results
                .map(e => e.id)
                .sort((a,b)=>  parseInt(b) - parseInt(a))
            testTableId = idsDescending[0]
            return done();
        });
    });
  test(`UPDATE Test Table at ID /${testTableId}`, (done) => {
    request(app)
      .put(`${ROOT_URL}/${testTableId}`)
      .set('Authorization', 'Bearer ' + authToken)
      .expect("Content-Type", /json/)
      .send({
        description: "Updated from Supertest [read_rest_api.test.js] at [" + currentTime + "]",
      })
      .expect(200)
      .expect((res) => {
        console.log(JSON.stringify(res))
        console.log(JSON.stringify(res.text))
        console.log(JSON.stringify(res.body))
      })
      .end((err, res) => {
        if (err) {
            logger.debug(JSON.stringify(res))
            logger.debug(res)
            console.log(JSON.stringify(res))
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
