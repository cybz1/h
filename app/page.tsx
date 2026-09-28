"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, LockKeyhole, RotateCcw } from "lucide-react";
import { BirthdayInvitation } from "@/components/birthday-invitation";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { birthdayCountdown } from "@/lib/birthday";
type Letter = { paragraphs: string[] };
function Flags() {
  return <div className="flag-keepsakes" aria-label="Iraq Pakistan and Libya">{["iraq", "pakistan", "libya"].map(country => <span className="emoji-flag" key={country}><img src={`/${country}.svg`} alt={`${country} flag`} width={42} height={28} /></span>)}</div>;
}

export default function Home() {
  const [pin, setPin] = useState("");
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [flapOpening, setFlapOpening] = useState(false);
  const [mapIntro, setMapIntro] = useState(true);
  const [letter, setLetter] = useState<Letter | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [opening, setOpening] = useState(false);
  const [starSecret, setStarSecret] = useState(false);
  const [invitationDone, setInvitationDone] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);
  const [clock, setClock] = useState<ReturnType<typeof birthdayCountdown> | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const birthdayNotice = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setMapIntro(false), reduced ? 0 : 5600);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const tick = () => setClock(birthdayCountdown(new Date()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => { if (letter && invitationDone) heading.current?.focus(); }, [letter, invitationDone]);
  async function unlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pin.length !== 8 || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/letter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (!response.ok) {
        setError(response.status === 401 ? "not quite our little code — try again ♡" : "your letter couldn't open just yet — please try again");
        setPin(""); return;
      }
      const data: Letter = await response.json();
      setOpening(true);
      await new Promise(resolve => setTimeout(resolve, 650));
      setLetter(data); setPin("");
    } catch { setError("a little connection hiccup — please try again"); }
    finally { setBusy(false); setOpening(false); }
  }
  return (
    <main className={letter ? (invitationDone ? "world is-open" : "world invitation-world") : `world minimal-entry ${!envelopeOpened ? "envelope-screen" : "vault-screen"} ${flapOpening ? "opening-envelope" : ""} ${mapIntro ? "intro-playing" : "intro-finished"}`}>
      {mapIntro && <div className="map-intro" aria-label="A pixel map highlighting Libya Iraq and Pakistan"><div className="map-stage"><img src="/pixel-map.svg" alt="Pixel map of Africa Europe and Asia with Libya Iraq and Pakistan highlighted" /><span className="map-label map-libya">libya</span><span className="map-label map-iraq">iraq</span><span className="map-label map-pakistan">pakistan</span><div className="map-trail trail-libya" /><div className="map-trail trail-iraq" /><div className="map-trail trail-pakistan" /></div></div>}
      {!letter ? (
        <section className="arrival" aria-label="Your birthday mail">
          <div className="mail-side">
            <div className={`mail-card ${opening ? "opening" : ""}`}>
              <h1 className="sr-only">a little letter for you</h1>
              {!envelopeOpened ? <div className="simple-envelope sealed"><div className="envelope-pocket" aria-hidden="true" /><div className="pixel-fold" aria-hidden="true" /><button type="button" className="heart-seal" aria-label="Open the envelope" disabled={flapOpening || mapIntro} onClick={() => { setFlapOpening(true); setTimeout(() => { setEnvelopeOpened(true); setFlapOpening(false); }, 650); }}><span>H+M</span></button></div> : <div className="vault-door">
              <div className="vault-lock" aria-hidden="true"><LockKeyhole size={34} strokeWidth={2.5} /></div>
              <form className="code-form" onSubmit={unlock}>
                <label id="pin-label" className="pixel-code-label">secret code</label>
                <InputOTP maxLength={8} value={pin} onChange={value => { setPin(value); setError(""); }} pattern="^[0-9]*$" inputMode="numeric" autoComplete="off" aria-labelledby="pin-label" aria-describedby="pin-note pin-error" aria-invalid={Boolean(error)} containerClassName="pin-container" disabled={busy}>
                  <InputOTPGroup className="pin-group">{Array.from({ length: 8 }, (_, i) => <InputOTPSlot key={i} index={i} className="pin-slot" />)}</InputOTPGroup>
                </InputOTP>
                <p id="pin-note" className="pin-note">you know the code already</p>
                <p id="pin-error" className="error" role="alert">{error}</p>
                <button className="open-button code-submit" type="submit" aria-label={busy ? "Opening your letter" : "Unlock your letter"} disabled={pin.length !== 8 || busy}><ArrowRight size={23} /></button>
              </form>
              </div>}
            </div>
            {envelopeOpened && <p className="below-card">a small surprise for someone who means so much</p>}
          </div>
        </section>
      ) : !invitationDone ? <BirthdayInvitation onComplete={() => { setInvitationDone(true); window.scrollTo({ top: 0, behavior: "instant" }); }} /> : (
        <div className="opened-content">
          <section className="birthday-banner" aria-label="The two of you holding hands by the Eiffel Tower">
            <img className="paris-together" src="/paris-together-short-curls.png" alt="A girl with long black hair and a boy with rounded dark curls and glasses holding hands in Paris with two kittens and the Eiffel Tower" width={1672} height={941} fetchPriority="high" />
            <h1 className="sr-only" ref={heading} tabIndex={-1}>a birthday letter for my favourite person</h1>
            <button className={`star-secret ${starSecret ? "is-revealed" : ""}`} type="button" aria-label="A little secret in the stars" aria-expanded={starSecret} aria-controls="star-message" onClick={() => setStarSecret(value => !value)}><span className="star-cluster" aria-hidden="true">✦ · ✧ · ✦</span><span id="star-message" className="star-message" hidden={!starSecret}>i love you</span></button>
          </section>
          <section className="countdown-panel" aria-label="Birthday countdown">
            <h2 className="countdown-heading">{clock?.isBirthday ? "happy birthday" : "05 october"}</h2>
            <div className="countdown" role="timer" aria-label={clock ? `${clock.days} days ${clock.hours} hours ${clock.minutes} minutes ${clock.seconds} seconds until your birthday` : "Loading countdown"}>
              {[['days', clock?.days], ['hours', clock?.hours], ['minutes', clock?.minutes], ['seconds', clock?.seconds]].map(([label, value]) => <div className="time-unit" key={label}><span className="time-number">{value === undefined ? "--" : String(value).padStart(2, "0")}</span><span className="time-label">{label}</span></div>)}
            </div>
          </section>
          <section className={`letter-scroll ${scrollOpen ? "is-unrolled" : "is-tied"}`} aria-label="Your tied birthday letter">
          <div className="scroll-roller scroll-roller-top" aria-hidden="true" />
          {!scrollOpen && <div className="rolled-paper"><button className="scroll-tie" type="button" aria-label="Untie the ribbon and read your letter" aria-expanded={scrollOpen} aria-controls="scroll-letter" onClick={() => setScrollOpen(true)}><span className="ribbon-loop ribbon-left" aria-hidden="true" /><span className="ribbon-loop ribbon-right" aria-hidden="true" /><span className="ribbon-knot">H+M</span></button></div>}
          <div className="scroll-unfold" aria-hidden={!scrollOpen} inert={!scrollOpen}><div className="scroll-contents">
          <article className="letter-paper" id="scroll-letter">
            <div className="letter-top"><h2>my favourite person<br />in the entire world</h2><img className="letter-kittens" src="/letter-kittens-pixel.png" alt="A cream kitten and a sleeping grey kitten cuddled together" width={1536} height={1024} /></div>
            <div className="letter-body">{letter.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
            <div className="character-poses"><img src="/her-pixel-poses.png" alt="Three pixel versions of her with black hair and brown eyes waving holding a heart and smiling" width={1775} height={887} loading="lazy" /></div>
            <div className="letter-signoff"><span className="paper-seal" aria-label="H plus M">H+M</span><Flags /></div>
          </article>
          </div></div>
          <div className="scroll-roller scroll-roller-bottom" aria-hidden="true" />
          </section>
          <button className="birthday-surprise" type="button" onClick={() => { if (!birthdayCountdown(new Date()).isBirthday) birthdayNotice.current?.showModal(); }}>click when its your birthday</button>
          <dialog className="birthday-notice" ref={birthdayNotice} aria-labelledby="birthday-notice-text" onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}><form method="dialog"><button className="notice-close" aria-label="Close birthday message">×</button><p id="birthday-notice-text">ah aha not your birthday yet wait</p></form></dialog>
          <button className="close-letter" onClick={() => { setLetter(null); setPin(""); setStarSecret(false); setScrollOpen(false); setInvitationDone(false); setEnvelopeOpened(false); window.scrollTo({ top: 0, behavior: "instant" }); }}><RotateCcw size={15} /> fold the letter back up</button>
        </div>
      )}
    </main>
  );
}

