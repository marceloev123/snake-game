import { Component, type ErrorInfo, type ReactNode } from "react";
import "./error-boundary.css";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary-container">
          <h1 className="error-boundary-title">Something went wrong</h1>
          <p className="error-boundary-message">{this.state.error.message}</p>
          <button className="error-boundary-reload-btn" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
