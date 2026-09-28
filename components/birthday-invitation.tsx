"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart } from "lucide-react";

type Step = "free" | "london" | "time" | "deposit" | "joke" | "declined";

export function BirthdayInvitation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>("free");
  const [dodges, setDodges] = useState(0);
  const [noPosition, setNoPosition] = useState<{ left: number; top: number } | null>(null);
  const [time, setTime] = useState("15:00");
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => { title.current?.focus(); }, [step]);
  const next = (value: Step) => { setDodges(0); setNoPosition(null); setStep(value); };
  const moveNo = () => {
    const left = dodges % 2 === 0 ? window.innerWidth * .08 : window.innerWidth * .78;
    const top = window.innerHeight * [ .72, .15, .25, .68 ][dodges % 4];
    setNoPosition({ left: Math.max(16, Math.min(left, window.innerWidth - 116)), top: Math.max(16, Math.min(top, window.innerHeight - 75)) });
    setDodges(value => value + 1);
  };
  const noButton = <button className={`invite-button no-choice ${noPosition ? "no-escaped" : ""}`} style={noPosition ? { position: "fixed", ...noPosition } : undefined} onPointerEnter={event => { if (event.pointerType === "mouse" && dodges < 5) moveNo(); }} onClick={() => { if (dodges >= 5) next("declined"); else moveNo(); }}>no</button>;
  const formattedTime = new Date(`2000-01-01T${time || "15:00"}`).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
  const titles: Record<Step, string> = {
    free: "are you free on your birthday?",
    london: "okay i'll come to london if you're free",
    time: "what time shall we meet?",
    deposit: "one tiny thing before we make it official",
    joke: "bru im joking",
    declined: "bru okay next year inshallah",
  };
  return <section className="invitation-shell" aria-label="A birthday invitation">
    <div className="invitation-card" key={step}>
      <div className="invitation-date"><span>05 october</span><Heart size={19} fill="currentColor" aria-hidden="true" /><span>H+M</span></div>
      <h1 ref={title} tabIndex={-1}>{titles[step]}</h1>
      {step === "free" && <>
        <p>i have a little question before your surprise</p>
        <div className="choice-field">
          <button className="invite-button yes-choice" onClick={() => next("london")}>yes ♡</button>
          {noButton}
        </div>
      </>}
      {step === "london" && <>
        <div className="invite-actions"><button className="invite-button" onClick={() => next("time")}>yes ♡</button>{noButton}</div>
      </>}
      {step === "time" && <form onSubmit={event => { event.preventDefault(); const chosenTime = new FormData(event.currentTarget).get("meeting-time"); if (typeof chosenTime === "string" && chosenTime) setTime(chosenTime); next("deposit"); }}>
        <label className="meeting-label" htmlFor="meeting-time">05 October</label>
        <input className="meeting-time" id="meeting-time" name="meeting-time" type="time" required step={900} value={time} onInput={event => setTime(event.currentTarget.value)} onChange={event => setTime(event.target.value)} />
        <button className="invite-button invite-next" type="submit">next <ArrowRight size={19} aria-hidden="true" /></button>
      </form>}
      {step === "deposit" && <>
        <p>okay to make sure you're coming<br />you have to pay a deposit of</p>
        <span className="deposit-amount">£500</span>
        <button className="invite-button invite-next" onClick={() => next("joke")}>next <ArrowRight size={19} aria-hidden="true" /></button>
      </>}
      {step === "joke" && <>
        <div className="meeting-ticket"><span>05 october</span><strong>{formattedTime}</strong><span>london</span></div>
        <p>send me a screenshot when ur done</p>
        <button className="invite-button invite-next" onClick={onComplete}>next <ArrowRight size={19} aria-hidden="true" /></button>
      </>}
      {step === "declined" && <>
        <button className="invite-button invite-next" onClick={onComplete}>next <ArrowRight size={19} aria-hidden="true" /></button>
      </>}
    </div>
  </section>;
}
