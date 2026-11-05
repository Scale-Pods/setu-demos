import { Home, Scan } from './screens/Home'
import { Officer } from './screens/Officer'
import { Pilgrim } from './screens/Pilgrim'
import { Platform } from './screens/Platform'
import { Sevak } from './screens/Sevak'
import { Provider, useApp } from './store'
import { Tour } from './Tour'
import { Backdrop, Toast } from './ui'

function Router() {
  const { route } = useApp()
  switch (route) {
    case 'scan': return <Scan />
    case 'citizen': return <Pilgrim />
    case 'volunteer': return <Sevak />
    case 'officer': return <Officer />
    case 'platform': return <Platform />
    default: return <Home />
  }
}

export default function App() {
  return (<Provider><Backdrop /><Router /><Tour /><Toast /></Provider>)
}
