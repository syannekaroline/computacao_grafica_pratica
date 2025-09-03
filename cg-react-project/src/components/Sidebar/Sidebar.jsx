import React from 'react';
import './Sidebar.css';
import SidebarNav from './SidebarNav';
import SidebarPanel from './SidebarPanel';

function Sidebar(props) {
  const { activeMenu, onMenuChange } = props;

  return (
    <aside className="sidebar-container">
      <SidebarNav
        activeMenu={activeMenu}
        onMenuChange={onMenuChange}
      />
      <SidebarPanel {...props} /> {/* Passa todas as props para o painel de conteúdo */}
    </aside>
  );
}

export default Sidebar;