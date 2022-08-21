import axios from 'axios';
import xml2js from 'xml2js';
import fs from 'fs';

//import gameData from './gamesData.js';

// import gamesWithCoopData from './gamesDataWithCoop2.js';


var parseString = xml2js.parseString;

const PLAT_API_KEY = 'GBT6Fzct103ONOddJNWm2aqwRhfbtvK8';
const PLAT_URL = 'https://platprices.com/api.php'




const fetchSalesData = async () => {

  const fetchedData1 = await axios.get(`${PLAT_URL}?key=${PLAT_API_KEY}&sales=1&region=FI`)
  //const fetchedData1 = await axios.get('https://platprices.com/api.php?key=GBT6Fzct103ONOddJNWm2aqwRhfbtvK8&sales=1&region=FI')

  //console.log('fetchedData1', fetchedData1.data)

  const activeSales = fetchedData1.data.sales;

  // console.log('activeSales', activeSales)

  const gamesOnActiveSales = {};

  for (const sale of activeSales) {
    const saleId = sale.ID;

    const fetchedGameData = await axios.get(`${PLAT_URL}?key=${PLAT_API_KEY}&sale=${saleId}`);

    //console.log(fetchedGameData.data.game_discounts.map(game => game.Name))

    gamesOnActiveSales[saleId] = fetchedGameData.data.game_discounts;

  }

  const saleIds = Object.keys(gamesOnActiveSales);

  saleIds.forEach(saleId =>
    gamesOnActiveSales[saleId].forEach(game =>
      game.trimmedName = game.Name
        .split('- ')[0]
        .replace('Digital Deluxe Edition', '')
        .replace('Deluxe Edition', '')
        .replace('Special Edition', '')
        .replace('Complete Edition', '')
        .replace('Definitive Edition', '')
        .replace('Edition', '')
        .replace('Collection', '')
        .trim())
  );

  return gamesOnActiveSales;
  //fs.writeFileSync('./gamesData.js', JSON.stringify(gamesOnActiveSales))


};






const fetchCoopData = async () => {

  const gameData = await fetchSalesData();

  const saleIds = Object.keys(gameData);

  await Promise.all(saleIds.map(async (saleId) =>
    await Promise.all(
      gameData[saleId]
        .map(async (game, index) => {

          const gameToSearch = encodeURIComponent(game.trimmedName);
          //console.log('gameToSearch', gameToSearch)

          game.coopData = [];


          if (game.IsPS4 === "1") {
            //console.log('PS4', game.trimmedName)
            const fetchedCoopDataPS4 = await axios.get(`https://api.co-optimus.com/games.php?search=true&name=${gameToSearch}&system=22`);
            const preppedData = fetchedCoopDataPS4.data.replace(/(\r\n|\n|\r)/gm, "");
            parseString(preppedData, (err, data) => {
              if(data?.games?.game) game.coopData = data.games.game;
            });
          }

          if (game.IsPS5 === "1") {
            //console.log('PS5', game.trimmedName)

            const fetchedCoopDataPS5 = await axios.get(`https://api.co-optimus.com/games.php?search=true&name=${gameToSearch}&system=30`);
            const preppedData = fetchedCoopDataPS5.data.replace(/(\r\n|\n|\r)/gm, "");
            parseString(preppedData, (err, data) => {
              if(data?.games?.game) game.coopData = data.games.game;
            });
          }

        }

        )
    )
  )
  );

  saleIds.forEach(saleId =>
    gameData[saleId].forEach(game => game.coopData.filter(coopgame => coopgame.local[0] !== '0'))
    )

  const gamesWithCoop = {}

  saleIds.forEach(saleId =>
    gamesWithCoop[saleId] = gameData[saleId].filter(game => game.coopData.length > 0)
    )
  
    console.log('gamesWithCoop', gamesWithCoop)

  fs.writeFileSync('./gamesDataWithCoop3.js', JSON.stringify(gamesWithCoop));


};




// const showData = () => {
//   const saleIds = Object.keys(gamesWithCoopData)
//   console.log('saleIds', saleIds)

//   saleIds.forEach(saleId =>
//     gamesWithCoopData[saleId].forEach(game => {
//       console.log(game.Name)

//       game.coopData[0].forEach(coop => {
//         console.log(coop.title)
//       })

//       console.log('---')
//     })
//   )

// }


//fetchSalesData();
fetchCoopData();
//showData();

