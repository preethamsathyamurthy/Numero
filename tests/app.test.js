const request = require('supertest');
const {app, mongoose} = require('../app');

describe('Test the numero module', () => {

  //to prevent open handlers
  afterAll(() => {
    mongoose.connection.close();
    app.close();
  });

  //POST Method tests
  test('should not accept an input of datatype other than {\'data\': numbers[]}', async() => {
    await request(app).post('/metric')
    .send([1,2,3])
    .expect(422)
  });

  test('should not accept array with lenth greater than 5', async() => {
    await request(app).post('/metric')
    .send({
      data: [1,2,3,4,5,6]
    })
    .expect(422)
  });

  test('should not accept an empty array', async() => {
    await request(app).post('/metric')
    .send({
      data: []
    })
    .expect(422)
  });


  test('should accept an input of datatype {\'data\': numbers[]}', async() => {
    await request(app).post('/metric')
    .send({
      data: [1,2,3,4]
    })
    .expect(201)
  });

  //GET Method tests
  test('custom minutes should be of the dataType  {\'minutes\' : number} or empty', async() => {
    await request(app).get('/metric')
    .send({
      minutes: "x"
    })
    .expect(422)
  });

  test('should return a cumulation of numbers in the last 30 minutes', async() => {
    await request(app).get('/metric')
    .send({
      minutes: 30
    })
    .expect(200)
    .expect(function(res){
      const response = res.body;
      if(!(Array.isArray(response)))
      {
        throw new Error("output obtained is not an array");
      }
      if(((response.length == 0) && (response.some(isNaN))))
      {
        throw new Error("Response obtained is not an array of numbers");
      }
    })
  });


  test('should return a cumulation of numbers in the last 5 minutes by default', async() => {
    await request(app).get('/metric')
    .expect(200)
    .expect(function(res){
      const response = res.body;
      if(!(Array.isArray(response)))
      {
        throw new Error("output obtained is not an array");
      }
      if(((response.length == 0) && (response.some(isNaN))))
      {
        throw new Error("Response obtained is not an array of numbers");
      }
    })
  });
});

