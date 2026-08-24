import React, { useState } from 'react';
import { Search, Bell, Menu, CalendarDays, ChevronDown, Sun, Moon } from 'lucide-react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import InventoryChart from './components/InventoryChart';
import WarehouseChart from './components/WarehouseChart';
import LowStock from './components/LowStock';
import TransactionsTable from './components/TransactionsTable';

export default function App({ theme, onToggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={21} /></button>
          <div className="search-box">
            <Search size={19} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for products, orders, suppliers..." />
            {query && <button className="clear-search" onClick={() => setQuery('')}>×</button>}
          </div>
          <div className="topbar-actions">
            <button className="icon-button theme-button" onClick={onToggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="icon-button notification-button" aria-label="Notifications">
              <Bell size={20} /><span>3</span>
            </button>
            <div className="profile-mini"><div className="avatar">IJ</div><div><strong>Innocent Jambaya</strong><small>Administrator</small></div><ChevronDown size={16} /></div>
          </div>
        </header>

        <section className="page-content">
          <div className="page-heading">
            <div><h1>Dashboard</h1><p>Welcome back, Innocent!</p></div>
            <button className="date-picker"><CalendarDays size={17} /> Aug 18, 2026 - Aug 24, 2026 <ChevronDown size={16} /></button>
          </div>

          <div className="stats-grid">
            <StatCard icon="box" label="Total Products" value="1,248" change="12.5%" tone="purple" />
            <StatCard icon="database" label="Total Stock" value="18,492" change="8.3%" tone="green" />
            <StatCard icon="cart" label="Total Orders" value="342" change="15.7%" tone="blue" />
            <StatCard icon="users" label="Total Suppliers" value="86" change="5.2%" tone="orange" />
          </div>

          <div className="dashboard-grid main-widgets">
            <InventoryChart />
            <WarehouseChart />
            <LowStock />
          </div>

          <TransactionsTable />
        </section>
      </main>
    </div>
  );
}
