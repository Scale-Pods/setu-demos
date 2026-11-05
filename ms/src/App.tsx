import { Citizen } from './screens/Citizen'
import { Home, Scan } from './screens/Entry'
import { Officer } from './screens/Officer'
import { Platform } from './screens/Platform'
import { Provider, useApp } from './store'
import { Tour } from './Tour'
import { Backdrop, Toast } from './ui'

function Router() {
  const { screen } = useApp()
  return screen === 'home' ? <Home /> : screen === 'citizen' ? <Citizen /> : screen === 'officer' ? <Officer /> : screen === 'platform' ? <Platform /> : <Scan />
}
export default function App() { return (<Provider><Backdrop /><Router /><Tour /><Toast /></Provider>) }
