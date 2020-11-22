const request = require('supertest');
const {app, mongoose} = require('../app');

describe('Test the numero module', () => {

  //to prevent open handlers
  afterAll(() => {
    mongoose.connection.close();
    app.close();
  });

  //POST Method tests
  test('POST method should not accept an input of datatype other than {\'data\': numbers[]}', async() => {
    await request(app).post('/metric')
    .send([1,2,3])
    .expect(422)
  });

  test('POST method should not accept array with lenth greater than 5', async() => {
    await request(app).post('/metric')
    .send({
      data: [1,2,3,4,5,6]
    })
    .expect(422)
  });

  test('POST method should not accept an empty array', async() => {
    await request(app).post('/metric')
    .send({
      data: []
    })
    .expect(422)
  });


  test('POST method should accept an input of datatype {\'data\': numbers[]}', async() => {
    await request(app).post('/metric')
    .send({
      data: [1,2,3,4]
    })
    .expect(201)
  });

  //GET Method tests
  test('GET method should not accept any value as input in the body', async() => {
    await request(app).get('/metric')
    .send({
      data: [1,2,3,4]
    })
    .expect(422)
  });

  test('GET method should return a cumulation of numbers exactly 5 ,10 and 30 minutes before execution in an array or be empty if no value', async() => {
    await request(app).get('/metric')
    .expect(200)
    .expect(function(res){
      const response = res.body;
      if(!(Array.isArray(response)))
      {
        throw new Error("output obtained is not an array");
      }
      if(((response.length > 0) && (response.some(isNaN))))
      {
        throw new Error("Response obtained is not an array of numbers");
      }
    })
  });
  

  /*
  test('custom minutes should be of the dataType  {\'minutes\' : number} or empty', async() => {
    await request(app).get('/metrics')
    .send({
      minutes: "x"
    })
    .expect(422)
  });

  test('should return a cumulation of numbers in the last 30 minutes', async() => {
    await request(app).get('/metrics')
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
      if(((response.length > 0) && (response.some(isNaN))))
      {
        throw new Error("Response obtained is not an array of numbers");
      }
    })
  });


  test('should return a cumulation of numbers in the last 5 minutes by default', async() => {
    await request(app).get('/metrics')
    .expect(200)
    .expect(function(res){
      const response = res.body;
      if(!(Array.isArray(response)))
      {
        throw new Error("output obtained is not an array");
      }
      if(((response.length > 0) && (response.some(isNaN))))
      {
        throw new Error("Response obtained is not an array of numbers");
      }
    })
  });
  */
});

