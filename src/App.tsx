import { ErrorBoundary } from './components/ui/ErrorBoundary'
import Index from './pages/Index'

function App() {
  return (
    <ErrorBoundary>
      <Index />
    </ErrorBoundary>
  )
}

export default App
