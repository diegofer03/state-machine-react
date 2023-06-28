import React from 'react';
import { Welcome } from '../component/Welcome';
import { Search } from '../component/Search';
import { Passengers } from '../component/Passenger';
import { Tickets } from '../component/Tickets';
import './StepsLayout.css';

export const StepsLayout = ({ state, send }) => {
  
  const renderContent = () => {
    if (state.matches('initial')) return <Welcome send={send} /> 
    if (state.matches('search')) return <Search send={send} state={state}/> 
    if (state.matches('tickets')) return <Tickets send={send} state={state}/> 
    if (state.matches('passengers')) return <Passengers send={send} state={state}/> 
    return null 
  };

  return (
    <div className='StepsLayout'>
      {renderContent()}
    </div>
  );
}; 