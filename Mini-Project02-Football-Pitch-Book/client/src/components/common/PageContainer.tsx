import { ReactNode } from "react";
import "./PageContainer.css";

interface PageContainerProps {
  title?: string;
  children: ReactNode;
}

export default function PageContainer({ title, children }: PageContainerProps) {
  return (
    <div className="ui-page-container">
      {title && <h1 className="ui-page-container__title">{title}</h1>}
      <div className="ui-page-container__content">{children}</div>
    </div>
  );
}
