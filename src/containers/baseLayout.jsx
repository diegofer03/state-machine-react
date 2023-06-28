import React from 'react';
import { useMachine } from '@xstate/react';
import { Nav } from '../component/Nav';
import { StepsLayout } from './StepsLayout';
import './BaseLayout.css';
import { bookingMachine } from '../machines/bookingMachine';

export const BaseLayout = () => {
  const [state, send] = useMachine(bookingMachine);
  console.log('nuestra maquina', state);
  return (
    <div className='BaseLayout'>
      <Nav state={state} send={send}/>
      <StepsLayout state={state} send={send}/>
    </div>
  );
}