import './App.css';
import { gamesWithCoopData } from './gamesDataWithCoop3';

import { useState } from 'react';

const saleIds = Object.keys(gamesWithCoopData);

const combinedGamesFromSales = [];

saleIds.forEach(saleId =>
  gamesWithCoopData[saleId]
    .forEach(game => {
      game.local = game.coopData.map(coop => coop.local[0])
      game.campaign = game.coopData.map(coop => coop.campaign[0])
      combinedGamesFromSales.push(game)
    }
    )
)



//console.log(gamesWithCoopData)
//console.log(combinedGamesFromSales)

const GameCard = ({ game }) => {
  //console.log(game.local)

  return (
    <div className="game-card" >

      <div className="game-card-image" >
        <img src={game.Img} alt='gameimg'></img>
      </div>
      <div className="game-card-body">

        <h2>{game.Name}</h2>

        <h5>{game.formattedSalePrice}({game.formattedBasePrice})</h5>
        {game.coopData.map(coopgame => <h5 key={coopgame.id}>{coopgame.title}</h5>)}
      </div>
    </div>
  )
};



function App() {

  const [hasLocalCoop, sethasLocalCoop] = useState(false);
  const [hasCampaign, setHasCampaign] = useState(false);

  let gamesToShow = combinedGamesFromSales;
  
  if (hasLocalCoop) {
    gamesToShow = gamesToShow.filter(game => game.local.some(i => i !== '0'));
  }
  if (hasCampaign) {
    gamesToShow = gamesToShow.filter(game => game.campaign.some(i => i !== '0'));
  }



  

  const FilterButtons = () => {

    return (
      <div>
        <button onClick={() => sethasLocalCoop(!hasLocalCoop)}>
          {hasLocalCoop ? 'Local Only' : 'Local & Online '}
        </button>
        <button onClick={() => setHasCampaign(!hasCampaign)}>
          {hasCampaign ? 'Campaign Only' : 'Campaign & Rest'}
        </button>
      </div>
    )
  }


  return (
    <div className="App">
      <FilterButtons />
      {
        gamesToShow.map(game => <GameCard key={game.PPID} game={game} /> )      
      }
    </div>
  );
}

export default App;
