import React from 'react';
import { Box, Database, ShoppingCart, Users, TrendingUp } from 'lucide-react';
const icons = { box: Box, database: Database, cart: ShoppingCart, users: Users };
export default function StatCard({ icon, label, value, change, tone }) { const Icon = icons[icon]; return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={22}/></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small><TrendingUp size={13}/> {change} <em>from last week</em></small></div></article>; }
