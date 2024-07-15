/* eslint-disable react/require-default-props */
import { createContext, useContext } from 'react';
import { Sidebar } from './Sidebar';
export const SidebarOpenContext = createContext({
  isOpen: true,
  onToggle: () => {},
  onClose: () => {}
});

export const useSidebarOpen = () => {
  return useContext(SidebarOpenContext);
};

export default Sidebar;
