import { ProgressSpinner } from "primereact/progressspinner";

export function LoadingSpinner() {
  return (
    <div className="centered-page">
      <ProgressSpinner strokeWidth="4" style={{ width: "48px", height: "48px" }} />
    </div>
  );
}
