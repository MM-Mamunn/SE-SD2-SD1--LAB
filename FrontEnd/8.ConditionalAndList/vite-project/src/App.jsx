import { Routes, Route } from 'react-router-dom'
import Home from './group1/Home'
import About from './group1/About'
import Dashboard from './group2/Dashboard'
import UseStateExample from './UseStateExample'
import EventHandlingExample from './EventHandlingExample'
import ConditionalAndListExample from './ConditionalAndListExample'

function App() {
  return (
    <div className="p-4">


      <div className="border p-4 rounded mt-4">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/group1/about" element={<About />} />
          <Route path="/group2/dashboard" element={<Dashboard />} />
          <Route path="/usestate" element={<UseStateExample />} />
          <Route path="/event-handling" element={<EventHandlingExample />} />
          <Route path="/conditional-list" element={<ConditionalAndListExample />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
