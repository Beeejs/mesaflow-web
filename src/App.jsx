import Layout from "./components/Layout"
/* Views */
import Presentation from "./pages/home/Presentation"
import Services from "./pages/home/Services"
import Benefits from "./pages/home/Benefits"
import Platform from "./pages/home/Platform"
import Contact from "./pages/home/Contact"

function App() {
  return (
    <Layout>
      <Presentation />
      <Services/>
      <Benefits />
      <Platform/>
      <Contact />
    </Layout>
  )
}

export default App
