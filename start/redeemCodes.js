const rootDir = require('path').resolve('./');
const { convertProfileToJSON } = require('../src/utils/fileConverter');

/*
1. Convert profile detials to JSON
2. Access to codes.csv for ernestfrwd01
    - Convert codes.csv to JSON
    ** INVOKE Puppeteer
      - Go to prepaid card center in JSON
      - Solve Fun-Captcha
      - Wait to be re-directed to fill in information
      - Access detail from profile.json based on codes.json's email
      - Fill in information
3. Submit information
4. Extract card info from website
*/

const fileName = 'ernestfrwd01';
const settlement = 'NEON';

const redeemCodes = async () => {
  //
}