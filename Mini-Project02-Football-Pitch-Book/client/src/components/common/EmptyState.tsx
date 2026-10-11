import "./EmptyState.css";

export interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="ui-empty-state">
      <p className="ui-empty-state__title">{title}</p>
      {description && <p className="ui-empty-state__description">{description}</p>}
    </div>
  );
}

export default EmptyState;
