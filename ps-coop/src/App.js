import './App.css';
import { gamesWithCoopData } from './gamesDataWithCoop3';

import { useState } from 'react';

const saleIds = Object.keys(gamesWithCoopData);


saleIds.forEach(saleId =>
  gamesWithCoopData[saleId]
    .forEach(game => {
      game.local = game.coopData.map(coop => coop.local[0])
      game.campaign = game.coopData.map(coop => coop.campaign[0])

    }
    )
)

console.log(gamesWithCoopData)

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


  const FilterButtons = () => {

    return (
      <div>
        <button onClick={() => sethasLocalCoop(!hasLocalCoop)}>
          {hasLocalCoop ? 'Local Only' : 'Local & Online '}
        </button>
        <button onClick={() => setHasCampaign(!hasCampaign)}>
          {hasLocalCoop ? 'Campaign Only' : 'Campaign & Rest'}
        </button>
      </div>
    )
  }


  return (
    <div className="App">
      <FilterButtons />
      {
        saleIds.map(saleId =>
          gamesWithCoopData[saleId].map(game => {
            if (hasLocalCoop && game.local.every(i => i === '0')) return null;
            return <GameCard key={game.PPID} game={game} />
          }
          ))
      }
    </div>
  );
}

export default App;
