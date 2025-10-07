"use client";

import React, { useEffect, useState } from "react";
import {
  JiggleSwitch,
  jiggleSwitchConfigs,
  JiggleSwitchType,
  jiggleSwitchTypes,
} from "@al00x/jiggle-switch";

export default function Home() {
  const [type, setType] = useState<JiggleSwitchType>("droop");
  const [toggle, setToggle] = useState(false);
  const [override, setOverride] = useState(false);
  const [aggro, setAggro] = useState(1);
  const [eros, setEros] = useState(1);
  const [temp, setTemp] = useState(1);
  const [mass, setMass] = useState(1);

  useEffect(() => {
    // if (override) return;

    const { aggro, eros, mass, temperature } = jiggleSwitchConfigs[type];
    setAggro(aggro);
    setMass(mass);
    setEros(eros);
    setTemp(temperature);
  }, [type, override]);

  return (
    <main>
      <section>
        <div className={`flex flex-col items-center justify-center`}>
          <div className={`inline-flex flex-col items-center relative`}>
            <h1 className={`font-bold text-5xl text-center`}>JIGGLE SWITCH</h1>
            <select
              className={`self-start ms-10 mt-4 mb-8`}
              onChange={(e) => setType(e.currentTarget.value as any)}
            >
              {jiggleSwitchTypes.map((key) => (
                <option key={key} value={key}>
                  {jiggleSwitchConfigs[key].name}
                </option>
              ))}
            </select>
          </div>
          <div className={`place-center flex-row! flex-wrap gap-8`}>
            <div className={`place-center flex-row! mt-5`}>
              <input
                id={"override-checkbox"}
                type={"checkbox"}
                checked={override}
                onChange={(e) => setOverride(e.currentTarget.checked)}
              />
              <label className={`ps-2`} htmlFor={"override-checkbox"}>
                Physics Override:
              </label>
            </div>
            <div
              className={`place-center gap-8 flex-row! flex-wrap ${!override ? "pointer-events-none opacity-50" : ""}`}
            >
              <MiniSlider
                label={"Aggro"}
                min={0}
                max={3}
                value={aggro}
                onValue={setAggro}
              />
              <MiniSlider
                label={"Eros"}
                min={0}
                max={3}
                value={eros}
                onValue={setEros}
              />
              <MiniSlider
                label={"Temperature"}
                min={0}
                max={3}
                value={temp}
                onValue={setTemp}
              />
              <MiniSlider
                label={"Mass"}
                min={0}
                max={5}
                value={mass}
                onValue={setMass}
              />
            </div>
          </div>
        </div>

        <div
          className={`place-center`}
          style={{
            width: "100%",
            marginTop: "0rem",
            padding: "5rem",
          }}
        >
          <JiggleSwitch
            type={type}
            value={toggle}
            onValue={setToggle}
            {...(override ? { aggro, temperature: temp, mass, eros } : {})}
          />
        </div>
      </section>
    </main>
  );
}

const MiniSlider = ({
  min,
  max,
  value,
  onValue,
  label,
  step = 0.1,

}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onValue: (e: number) => void;
  step?: number;
}) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <span
        style={{ fontWeight: 600, color: "white", marginBottom: "0.25rem" }}
      >
        {label}: {value}
      </span>
      <input
        style={{ accentColor: "#3c053b" }}
        type={"range"}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValue(+e.currentTarget.value)}
      />
    </div>
  );
};
