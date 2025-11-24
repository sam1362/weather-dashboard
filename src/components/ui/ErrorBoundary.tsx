import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message?: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: undefined }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error('UI-feil', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="min-h-screen bg-midnight text-slate-100">
          <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-10">
            <h1 className="text-2xl font-bold">Noe gikk galt</h1>
            <p className="text-sm text-slate-300">{this.state.message}</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
