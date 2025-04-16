import React from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../lib/utils';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const menuItems: MenuItem[] = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/analyze', label: 'Analyze', icon: ChartBarIcon },
  { path: '/documents', label: 'Documents', icon: DocumentTextIcon },
  { path: '/settings', label: 'Settings', icon: AdjustmentsHorizontalIcon },
];

interface StyledLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const StyledLink = React.forwardRef<HTMLAnchorElement, StyledLinkProps>(
  ({ className, children, href, ...props }, ref) => {
    const [location] = useLocation();
    const isActive = location === href;
    
    return (
      <Link href={href}>
        <a
          ref={ref}
          {...props}
          className={cn(
            'flex items-center rounded-lg px-4 py-2 text-gray-700 transition-colors',
            isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100',
            className
          )}
        >
          {children}
        </a>
      </Link>
    );
  }
);

StyledLink.displayName = 'StyledLink';

const Sidebar: React.FC = () => {
  return (
    <motion.div
      className="flex h-screen w-64 flex-col bg-white p-4 shadow-lg"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">LexiMind</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <StyledLink href={item.path}>
                  <Icon className="mr-3 h-6 w-6" />
                  <span>{item.label}</span>
                </StyledLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <button className="mt-auto flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        <PlusIcon className="mr-2 h-5 w-5" />
        <span>New Analysis</span>
      </button>
    </motion.div>
  );
};

export default Sidebar;
