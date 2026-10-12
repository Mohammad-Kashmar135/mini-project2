import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <section className="not-found-page">
      <p className="not-found-page__code" aria-hidden="true">
        404
      </p>

      <h1 className="not-found-page__title">Page not found</h1>

      <p className="not-found-page__text">
        Sorry, we could not find the page you were looking for. It may have
        moved, or the address may be wrong.
      </p>

      <Link className="not-found-page__link" to="/">
        Back to Home
      </Link>
    </section>
  );
}
