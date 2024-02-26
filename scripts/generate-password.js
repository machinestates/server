const Password = require('../shared/password');


void async function () { 

  const password = 'blahBlah23';

  try {
    const hashed = await Password.generateHash(password);
    console.log(hashed);
  } catch (error) {
    console.log(error);
  }

}();