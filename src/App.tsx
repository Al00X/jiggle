import React, {useState} from 'react';
import './App.css';
import {JiggleSwitch, jiggleSwitchConfigs, JiggleSwitchType, jiggleSwitchTypes} from "./jiggle-switch";

function App() {
  const [type, setType] = useState<JiggleSwitchType>('droop');
  const [toggle, setToggle] = useState(false);

  return (
     <main style={{ width: '100vw', height: '100vh', display: 'flex', maxWidth: '60rem', margin: 'auto' }}>
      <section
        style={{
          margin: 'auto',
          width: '80%',
          padding: '10rem',
          background: 'radial-gradient(#8f3985, #441c45)',
        }}
      >
        <h1 style={{ fontWeight: 900, color: 'white', fontSize: '3rem' }}>JIGGLE SWITCH</h1>
        <select
          onChange={(e) => setType(e.currentTarget.value as any)}
          style={{ alignSelf: 'start', marginLeft: '12rem',marginBottom: 0 }}
        >
          { jiggleSwitchTypes.map(key => <option key={key} value={key}>{ jiggleSwitchConfigs[key].name }</option>) }
        </select>
        <section
          style={{
            width: '100%',
            marginTop: '0rem',
            padding: '5rem',
          }}
        >
          <JiggleSwitch type={type} value={toggle} onValue={setToggle} />
        </section>
      </section>
    </main>
  );
}

export default App;
