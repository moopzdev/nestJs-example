import { rm } from 'fs/promises';
import { join } from 'path';

const clearDb = async (message) => {
  console.log(message);
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {
    console.log(error);
  }
};

global.beforeEach(() => clearDb('beforeEach'));

global.afterAll(() => clearDb('afterAll'));
