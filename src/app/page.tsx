'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowDownLeft, ArrowRight, ArrowUpRight, ChartNoAxesColumnIncreasing, Check,
  ChevronRight, Coffee, House, Landmark, Leaf, Lightbulb, Plus, ShieldCheck,
  ShoppingBasket, TrainFront, Wallet, X } from 'lucide-react';
import { demoSummary, parseAmount, readExpenses, STORAGE_KEY, usd, type DemoExpense } from '@/lib/money';

export default function Home() {
  const [expenses, setExpenses] = useState<DemoExpense[]>([]);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [showTip, setShowTip] = useState(true);
  const [tipExpanded, setTipExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const { free, spent, netWorth } = demoSummary(expenses);

  useEffect(() => {
    try { setExpenses(readExpenses(localStorage.getItem(STORAGE_KEY))); }
    catch { setStorageError('Saved demo data could not be loaded. Nothing has been overwritten.'); }
    setReady(true);
  }, []);

  function persist(next: DemoExpense[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setExpenses(next);
      return true;
    } catch {
      setFormError('Your browser could not save this expense. Your input is still here.');
      return false;
    }
  }

  function saveExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const cents = parseAmount(String(data.get('amount')));
    const merchant = String(data.get('merchant')).trim();
    if (cents === null || !merchant) { setFormError('Enter a name and a positive amount with up to two decimal places.'); return; }
    if (expenses.length >= 1000) { setFormError('This demo supports up to 1,000 entries. Reset the demo to try again.'); return; }
    if (persist([{ id: crypto.randomUUID(), merchant, cents, date: new Date().toISOString() }, ...expenses])) {
      form.reset(); dialog.current?.close(); setNotice('Demo expense saved on this device.');
    }
  }

  function resetDemo() {
    if (!window.confirm('Reset your demo expenses? This only removes entries added to this preview.')) return;
    try { localStorage.removeItem(STORAGE_KEY); setExpenses([]); setStorageError(''); setNotice('Demo reset.'); }
    catch { setStorageError('Your browser could not reset the demo.'); }
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <aside className="sidebar" aria-label="Main navigation">
        <a className="brand" href="#home"><span className="brand-mark"><Wallet size={23}/></span>MoneyTracker<span className="brand-dot">.</span></a>
        <p className="nav-caption">YOUR SPACE</p>
        <nav>
          <a href="#home" className="nav-link current" aria-current="page"><House size={20}/>Overview</a>
          <a href="#activity" className="nav-link"><ArrowDownLeft size={20}/>Recent activity</a>
          <a href="#assets" className="nav-link"><ChartNoAxesColumnIncreasing size={20}/>Your assets</a>
          <a href="#goals" className="nav-link"><ShieldCheck size={20}/>Your goals</a>
        </nav>
        <div className="sidebar-note"><Leaf size={23}/><p>A little clarity.<br/>A little closer to your goals.</p></div>
        <div className="household"><div className="avatar-pair"><span>A</span><span>S</span></div><div><strong>Our household</strong><small>Alex & Sam · Demo</small></div></div>
      </aside>

      <main id="main">
        <header className="topbar" id="home">
          <a href="#home" className="mobile-brand"><Wallet size={22}/>MoneyTracker</a>
          <span className="breadcrumb">Your household <ChevronRight size={13}/> Overview</span>
          <div className="topbar-right"><span className="demo-badge"><span/>Demo preview</span><span className="currency">USD</span><div className="avatar" aria-label="Sample household member Alex">A</div></div>
        </header>

        <div className="page-content">
          <section className="page-heading"><div><p className="eyebrow">A LITTLE MORE CLARITY</p><h1>Your money, at a glance<span>.</span></h1><p className="intro">Room for today. A plan for tomorrow.</p></div><div className="month-label">October 2026<small>Sample month</small></div></section>
          <p className="demo-explainer">A space to try things out. All balances are sample data.</p>
          {storageError && <div className="error-banner" role="alert">{storageError} <button onClick={resetDemo}>Reset demo</button></div>}

          <div className="dashboard-grid">
            <div className="primary-column">
              <section className="balance-card" aria-labelledby="free-heading">
                <div className="balance-top"><span id="free-heading">Free to spend</span><Wallet size={25} strokeWidth={1.4}/></div>
                <p className={`balance-number ${free < 0 ? 'deficit' : ''}`}>{ready ? usd(free) : '—'}</p>
                <p className="balance-caption">{free < 0 ? 'Over your available budget' : 'After bills, savings & personal allowances'}</p>
                <div className="balance-bottom"><span><span className="status-dot"/>Until October 31</span><button className="balance-details" onClick={() => { const el = document.getElementById('breakdown'); if (el instanceof HTMLDetailsElement) el.open = !el.open; }}>How it’s calculated <ArrowRight size={16}/></button></div>
                <details id="breakdown"><summary>Sample balance breakdown</summary><dl><div><dt>Available cash</dt><dd>{usd(300000 - (spent - 124000))}</dd></div><div><dt>Reserved savings</dt><dd>−$800</dd></div><div><dt>Remaining bills & budgets</dt><dd>−$900</dd></div><div><dt>Planned savings</dt><dd>−$200</dd></div><div><dt>Personal allowances</dt><dd>−$300</dd></div></dl></details>
              </section>

              <div className="stat-grid">
                <section className="stat-card"><div className="stat-top"><span className="icon-tile"><ArrowUpRight size={21}/></span><span>THIS MONTH</span></div><h2>Spent so far</h2><p className="stat-number">{ready ? usd(spent) : '—'}</p><a href="#activity">See your activity <ArrowRight size={14}/></a></section>
                <section className="stat-card"><div className="stat-top"><span className="icon-tile"><ChartNoAxesColumnIncreasing size={21}/></span><span>ALL ASSETS</span></div><h2>Net worth</h2><p className="stat-number">{ready ? usd(netWorth) : '—'}</p><a href="#assets">Estimated value <ArrowRight size={14}/></a></section>
              </div>

              <section className="activity-card" id="activity"><div className="section-heading"><h2>Recent activity</h2><span>Sample + your demo entries</span></div>
                {expenses.slice(0, 3).map(entry => <div className="transaction" key={entry.id}><span className="icon-tile"><ShoppingBasket size={20}/></span><div><strong>{entry.merchant}</strong><small>Extra spending · Demo</small></div><strong className="transaction-amount">−{usd(entry.cents)}</strong></div>)}
                <div className="transaction"><span className="icon-tile"><ShoppingBasket size={20}/></span><div><strong>Fresh Market</strong><small>Groceries · Oct 10</small></div><strong className="transaction-amount">−$42.80</strong></div>
                <div className="transaction"><span className="icon-tile"><Coffee size={20}/></span><div><strong>Sunday Coffee</strong><small>Eating out · Oct 10</small></div><strong className="transaction-amount">−$8.50</strong></div>
                <div className="transaction"><span className="icon-tile"><TrainFront size={20}/></span><div><strong>Metro</strong><small>Transport · Oct 9</small></div><strong className="transaction-amount">−$3.20</strong></div>
                <button ref={addButton} className="add-expense" disabled={!ready || Boolean(storageError)} onClick={() => { setFormError(''); dialog.current?.showModal(); }}><Plus size={20}/>Add expense<span>Try the demo</span></button>
              </section>
            </div>

            <div className="secondary-column">
              <section className="goals-card" id="goals"><div className="section-heading"><h2>Making room for the future</h2><span className="gold-dot"/></div><div className="home-goal"><span className="goal-icon"><House size={26} strokeWidth={1.5}/></span><span className="pill">OUR SHARED GOAL</span><h3>A place to call home</h3><p>Little by little, building something of our own.</p><div className="goal-total">$8,000 <span>saved together</span></div><details className="goal-details"><summary>About this goal <ArrowRight size={16}/></summary><p>Your target is not set yet. Once you choose a price range, your plan can show how much to save each month. Goal editing will be added in a later step.</p></details></div><div className="emergency-goal"><div><span className="small-goal-icon"><ShieldCheck size={20}/></span><h3>Emergency fund</h3><span className="percentage">60%</span></div><progress value="3000" max="5000" aria-label="Emergency fund: $3,000 of $5,000"/><p><strong>$3,000</strong><span>of $5,000</span></p></div></section>

              {showTip && <aside className="learning-card"><div className="learning-top"><span><Lightbulb size={17}/>A SMALL MONEY NOTE</span><button aria-label="Dismiss money note" onClick={() => setShowTip(false)}><X size={17}/></button></div><h2>Not all your money is spending money.</h2><p>Your net worth includes investments. Your free-to-spend balance focuses on what’s available after your planned commitments.</p>{tipExpanded && <p>Moving money into savings does not make you poorer — it gives those same dollars a purpose. This is a general explanation, not a personal recommendation.</p>}<button className="text-button" onClick={() => setTipExpanded(!tipExpanded)}>{tipExpanded ? 'Show less' : 'A little more'}<ArrowRight size={15}/></button></aside>}
            </div>
          </div>

          <section className="assets-card" id="assets"><div className="section-heading"><h2>The bigger picture</h2><span>Sample valuations · USD</span></div><div className="asset-list">{[['Cash & bank', 440000 - (spent - 124000)], ['Deposits', 800000], ['Freedom Broker', 900000], ['Galt & Taggart', 700000], ['Crypto', 400000]].map(([name, value]) => <div className="asset" key={name}><Landmark size={18}/><span>{name}</span><strong>{ready ? usd(Number(value)) : '—'}</strong></div>)}</div><p className="asset-note">The demo starts with $3,000 in cash available for everyday spending. Other assets are excluded from “Free to spend”.</p></section>
          <footer className="page-footer"><span><ShieldCheck size={14}/>Demo entries stay in this browser. No accounts connected.</span><button onClick={resetDemo}>Reset demo</button></footer>
          <p className="save-notice" role="status">{notice}</p>
        </div>
      </main>

      <nav className="mobile-nav" aria-label="Page sections"><a href="#home"><House size={21}/><span>Home</span></a><a href="#activity"><ArrowDownLeft size={21}/><span>Activity</span></a><a href="#assets"><ChartNoAxesColumnIncreasing size={21}/><span>Assets</span></a><a href="#goals"><ShieldCheck size={21}/><span>Plan</span></a></nav>

      <dialog ref={dialog} aria-labelledby="expense-title" className="expense-dialog" onClose={() => addButton.current?.focus()}><div className="dialog-heading"><span className="icon-tile"><Plus size={22}/></span><button aria-label="Close expense form" onClick={() => dialog.current?.close()}><X size={22}/></button></div><p className="eyebrow">TRY IT OUT</p><h2 id="expense-title">Add a demo expense</h2><p className="dialog-description">An extra purchase outside the planned budget. It reduces the sample cash and free-to-spend balance.</p><form onSubmit={saveExpense}><label htmlFor="merchant">What was it for?</label><input id="merchant" name="merchant" placeholder="e.g. A new notebook" maxLength={60} required autoFocus/><label htmlFor="amount">Amount · USD</label><input id="amount" name="amount" inputMode="decimal" placeholder="0.00" required autoComplete="off"/><p className="field-hint">Saved only in this browser. Use sample data.</p>{formError && <p className="form-error" role="alert">{formError}</p>}<button className="add-expense" type="submit"><Check size={19}/>Save demo expense</button></form></dialog>
    </div>
  );
}
