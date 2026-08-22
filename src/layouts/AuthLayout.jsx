import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-mesa-bg text-mesa-text">
      <Outlet />
    </div>
  )
}

export default AuthLayout