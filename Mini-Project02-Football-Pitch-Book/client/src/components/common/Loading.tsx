import "./Loading.css";

export interface LoadingProps {
  message?: string;
}

export function Loading({ message }: LoadingProps) {
  return (
    <div className="ui-loading" role="status" aria-live="polite">
      <span className="ui-loading__spinner" aria-hidden="true" />
      {message ? (
        <p className="ui-loading__message">{message}</p>
      ) : (
        <span className="ui-loading__sr-only">Loading…</span>
      )}
    </div>
  );
}

export default Loading;
