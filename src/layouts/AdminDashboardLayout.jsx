/* Layouts */
import DashboardLayout from './DashboardLayout'

/* Constants */
import { adminDashboardNavigation } from '../constants/constants'

const AdminDashboardLayout = () => {
  return (
    <DashboardLayout
      navigation={adminDashboardNavigation}
    />
  )
}

export default AdminDashboardLayout