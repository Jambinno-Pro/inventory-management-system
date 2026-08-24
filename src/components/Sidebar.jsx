import React from 'react';
import { X, LayoutDashboard, Box, Tags, Package, Warehouse, Truck, ClipboardList, ShoppingCart, ArrowLeftRight, Users, BarChart3, UserRound, ShieldCheck, History, Settings, Boxes } from 'lucide-react';

const main = [
  ['Dashboard', LayoutDashboard], ['Products', Box], ['Categories', Tags], ['Inventory', Package], ['Warehouses', Warehouse], ['Suppliers', Truck], ['Purchase Orders', ClipboardList], ['Sales Orders', ShoppingCart], ['Transfers', ArrowLeftRight], ['Customers', Users], ['Reports', BarChart3]
];
const system = [['Users', UserRound], ['Roles', ShieldCheck], ['Audit Logs', History], ['Settings', Settings]];

export default function Sidebar({ open, onClose }) {
  const render = (items) => items.map(([label, Icon]) => <button key={label} className={`nav-item ${label === 'Dashboard' ? 'active' : ''}`}><Icon size={18}/><span>{label}</span></button>);
  return <aside className={`sidebar ${open ? 'open' : ''}`}>
    <div className="brand-row"><div className="brand-mark"><Boxes size={25}/></div><div><div className="brand">StockFlow</div><div className="brand-sub">Inventory System</div></div><button className="sidebar-close" onClick={onClose}><X size={19}/></button></div>
    <nav><div className="nav-section">MAIN</div>{render(main)}<div className="nav-section system-label">SYSTEM</div>{render(system)}</nav>
    <div className="sidebar-user"><div className="avatar large">IJ</div><div><strong>Innocent Jambaya</strong><span>Administrator</span></div></div>
  </aside>;
}
