const db = require('./db');

describe('In-Memory DB Tests', () => {
  it('should sign up a new user', () => {
    const credentials = db.signup('newuser@test.com', 'mypassword');
    expect(credentials).toHaveProperty('token');
    expect(credentials).toHaveProperty('username', 'newuser@test.com');
  });

  it('should authenticate a valid user', () => {
    const credentials = db.login('test@test.at', '12345678');
    expect(credentials).not.toBeNull();
    expect(credentials).toHaveProperty('token');
    expect(credentials.username).toBe('test@test.at');
  });

  it('should return null for incorrect login credentials', () => {
    const credentials = db.login('test@test.at', 'wrongpassword');
    expect(credentials).toBeNull();
  });
});
