/* Views */
import Benefits from "./views/Benefits"
import Contact from "./views/Contact"
import Platform from "./views/Platform"
import Presentation from "./views/Presentation"
import Services from "./views/Services"

const Home = () => {
  return (
    <>
      <Presentation />
      <Services />
      <Benefits />
      <Platform />
      <Contact />
    </>
  )
}

export default Home