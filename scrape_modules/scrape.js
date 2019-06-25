const puppeteer = require('puppeteer');

async function getBio(page){
  return await page.$eval('.-vDIg', el => el.innerText);
}

async function calculateAverage(likes){
  let sum = 0;
  for(let like of likes){
    if(like.includes("k")){
      sum += parseInt(like.split('\n')[0]) * 1000.0;
    }
    else{
      sum += parseInt(like.split('\n')[0]);
    }
  }
  console.log('SUM : ' + sum);
  console.log(likes)
  return sum / likes.length;
}

async function getAverageLikes(page){
  var likes = [];

  try{
    await page.hover('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > a > div > div.KL4Bh');
    likes.push(await page.$eval('.qn-0x', el => el.innerText));
  } catch(e){
    return 0;
  }

  try{
    await page.hover('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(2) > a > div > div.KL4Bh');
    likes.push(await page.$eval('.qn-0x', el => el.innerText));
  } catch(e){
    return calculateAverage(likes.slice(likes.length-2, likes.length-1));
  }

  try{
    await page.hover('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(3) > a > div > div.KL4Bh');
    likes.push(await page.$eval('.qn-0x', el => el.innerText));
  } catch(e){
    return calculateAverage(likes.slice(likes.length-2, likes.length-1));
  }

  try{
    await page.hover('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > a > div.eLAPa > div.KL4Bh');
    likes.push(await page.$eval('.qn-0x', el => el.innerText));
  } catch(e){
    return calculateAverage(likes.slice(likes.length-2, likes.length-1));
  }

  try{
    await page.hover('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > a > div > div.KL4Bh');
    likes.push(await page.$eval('.qn-0x', el => el.innerText));
  } catch(e){
    return calculateAverage(likes.slice(likes.length-2, likes.length-1));
  }

  try{
    await page.hover('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(3) > a > div > div.KL4Bh');
    likes.push(await page.$eval('.qn-0x', el => el.innerText));
  } catch(e){
    return calculateAverage(likes.slice(likes.length-2, likes.length-1));
  }

  try{
    await page.hover('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(3) > div:nth-child(1) > a > div > div.KL4Bh');
    likes.push(await page.$eval('.qn-0x', el => el.innerText));
  } catch(e){
    return calculateAverage(likes.slice(likes.length-2, likes.length-1));
  }

  try{
    await page.hover('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(3) > div:nth-child(2) > a > div > div.KL4Bh');
    likes.push(await page.$eval('.qn-0x', el => el.innerText));
  } catch(e){
    return calculateAverage(likes.slice(likes.length-2, likes.length-1));
  }

  try{
    await page.hover('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(3) > div:nth-child(3) > a > div > div.KL4Bh');
    likes.push(await page.$eval('.qn-0x', el => el.innerText));
  } catch(e){
    return calculateAverage(likes.slice(likes.length-2, likes.length-1));
  }

  try{
    await page.hover('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(4) > div:nth-child(1) > a > div.eLAPa > div.KL4Bh');
    likes.push(await page.$eval('.qn-0x', el => el.innerText));
  } catch(e){
    return calculateAverage(likes.slice(likes.length-2, likes.length-1));
  }
  return await calculateAverage(likes);
}

module.exports.getData = async function getData(username) {
  try{
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://instagram.com/' + username);

    let likes = await getAverageLikes(page);
    let bio = await getBio(page);
    return {likes: likes, bio: bio}

  } catch(e) {
    console.log('our error : ' + e);
    return {err: e}
  }
};

module.exports.isAvaible = async function(user){
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://instagram.com/' + user);

  try{
    let content = await page.$eval('body > div > div.page.-cx-PRIVATE-Page__body.-cx-PRIVATE-Page__body__ > div > div > h2', el => el.innerText);
  } catch(e){
    return true;
  } finally{
    await browser.close();
  }

  return false;
};

module.exports.isValidUser = async function(user){
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://instagram.com/' + user);

  try{
    let content = await page.$eval('body > div > div.page.-cx-PRIVATE-Page__body.-cx-PRIVATE-Page__body__ > div > div > h2', el => el.innerText);
    if(content != undefined) return false;
  } catch(e){
    return true;
  } finally{
    await browser.close()
  }
}
