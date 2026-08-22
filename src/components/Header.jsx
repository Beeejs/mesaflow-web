import Logo from "./Logo"
import Navbar from "./Navbar"

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-mesa-border/80 bg-mesa-bg/80 backdrop-blur-xl">
      <div className="flex justify-between items-center w-full gap-12 py-4 laptop:py-4 transition-all ease duration-200">
        <Logo/>
        <div className='w-full laptop:hidden'>
          <Navbar/>
        </div>
      </div>
    </header>
  )
}

export default Header