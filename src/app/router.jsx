import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout            from './layouts/AuthLayout.jsx'
import AppLayout             from './layouts/AppLayout.jsx'
import ProtectedRoute        from '../shared/components/guards/ProtectedRoute.jsx'
import LoginPage             from '../features/auth/pages/LoginPage.jsx'
import DashboardPage         from '../features/dashboard/pages/DashboardPage.jsx'
import CustomersPage         from '../features/crm/pages/CustomersPage.jsx'
import CustomerDetailPage    from '../features/crm/pages/CustomerDetailPage.jsx'
import LeadsPage             from '../features/crm/pages/LeadsPage.jsx'
import LeadDetailPage        from '../features/crm/pages/LeadDetailPage.jsx'
import AiPage                from '../features/ai/pages/AiPage.jsx'
import InventoryPage         from '../features/inventory/pages/InventoryPage.jsx'
import ProductDetailPage     from '../features/inventory/pages/ProductDetailPage.jsx'
import StockMovementsPage    from '../features/inventory/pages/StockMovementsPage.jsx'
import FinancePage           from '../features/finance/pages/FinancePage.jsx'
import TransactionDetailPage from '../features/finance/pages/TransactionDetailPage.jsx'
import ProjectsPage          from '../features/projects/pages/ProjectsPage.jsx'
import ProjectDetailPage     from '../features/projects/pages/ProjectDetailPage.jsx'
import HrPage                from '../features/hr/pages/HrPage.jsx'
import EmployeeDetailPage    from '../features/hr/pages/EmployeeDetailPage.jsx'
import AttendancePage        from '../features/hr/pages/AttendancePage.jsx'
import ReportsPage           from '../features/reports/pages/ReportsPage.jsx'
import AnalyticsPage         from '../features/analytics/pages/AnalyticsPage.jsx'
import SettingsPage          from '../features/settings/pages/SettingsPage.jsx'
import PosPage               from '../features/pos/pages/PosPage.jsx'
import PosHistoryPage        from '../features/pos/pages/PosHistoryPage.jsx'
import PosSettingsPage       from '../features/pos/pages/PosSettingsPage.jsx'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard"           element={<DashboardPage />} />
            <Route path="/crm/customers"       element={<CustomersPage />} />
            <Route path="/crm/customers/:id"   element={<CustomerDetailPage />} />
            <Route path="/crm/leads"           element={<LeadsPage />} />
            <Route path="/crm/leads/:id"       element={<LeadDetailPage />} />
            <Route path="/ai"                  element={<AiPage />} />
            <Route path="/inventory"           element={<InventoryPage />} />
            <Route path="/inventory/:id"       element={<ProductDetailPage />} />
            <Route path="/inventory/movements" element={<StockMovementsPage />} />
            <Route path="/finance"             element={<FinancePage />} />
            <Route path="/finance/:id"         element={<TransactionDetailPage />} />
            <Route path="/projects"            element={<ProjectsPage />} />
            <Route path="/projects/:id"        element={<ProjectDetailPage />} />
            <Route path="/hr"                  element={<HrPage />} />
            <Route path="/hr/employees/:id"    element={<EmployeeDetailPage />} />
            <Route path="/hr/attendance"       element={<AttendancePage />} />
            <Route path="/reports"             element={<ReportsPage />} />
            <Route path="/analytics"           element={<AnalyticsPage />} />
            <Route path="/settings"            element={<SettingsPage />} />
            <Route path="/pos"                 element={<PosPage />} />
            <Route path="/pos/history"         element={<PosHistoryPage />} />
            <Route path="/pos/settings"        element={<PosSettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
