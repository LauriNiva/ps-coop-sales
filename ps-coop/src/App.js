import './App.css';
import { gamesWithCoopData } from './gamesDataWithCoop3';
// import gamesWithCoopData from './gamesDataWithCoop2';

import { useState } from 'react';

const saleIds = Object.keys(gamesWithCoopData);


saleIds.forEach(saleId => 
  gamesWithCoopData[saleId]
  .forEach(game => game.local = game.coopData
    .map(coop => coop.local[0])
)
)


const GameCard = ({ game }) => {
  //console.log(game.local)

  return (
    <div className="game-card">
      <h4>{game.Name}</h4>
      <h5>{game.formattedSalePrice}({game.formattedBasePrice})</h5>
      {game.coopData.map(coopgame => <h5 key={coopgame.id}>{coopgame.title}</h5>)}
    </div>
  )
};



function App() {

  const [localCoop, setLocalCoop] = useState(false);


  const FilterButtons = () => {

    return (
      <div>
        <button onClick={() => setLocalCoop(!localCoop)}>
          {localCoop ? 'Local Only' : 'Local & Online '}
        </button>
      </div>
    )
  }


  return (
    <div className="App">
      <FilterButtons />
      {
        saleIds.map(saleId =>
          gamesWithCoopData[saleId].map(game =>{
           if(localCoop && game.local.every(i => i === '0')) return null;
           return <GameCard  key={game.PPID} game={game} />
          }
          ))
      }
    </div>
  );
}

export default App;