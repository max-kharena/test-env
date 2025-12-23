import { Route, Routes } from 'react-router';
import Layout from '@/layout/base-layout';
import Dashboard from '@/pages/dashboard';
import Accounts from '@/pages/accounts';
import Alerts from '@/pages/alerts';
import Contracts from '@/pages/contracts';
import Reporting from '@/pages/reporting';
import Transactions from '@/pages/transactions';
import Vendors from '@/pages/vendors';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="contracts" element={<Contracts />} />
        <Route path="reporting" element={<Reporting />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;