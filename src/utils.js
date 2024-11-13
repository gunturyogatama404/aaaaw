require('colors');

const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function displayHeader() {
    process.stdout.write('\x1Bc');
    console.log('=================================================================='.cyan);
    console.log('=                       Ace Market                               ='.cyan);
    console.log('=                  Recode by vodka.ace                           ='.cyan);
    console.log('= https://app.getgrass.io/register/?referralCode=3zoAM4QCy4c_086 ='.cyan);
    console.log('=================================================================='.cyan);
    console.log();
  }

module.exports = { delay, displayHeader };
