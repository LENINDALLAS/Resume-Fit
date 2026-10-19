import { ProgressSpinner } from "primereact/progressspinner";

export function LoadingSpinner() {
  return (
    <div className="centered-page">
      <ProgressSpinner strokeWidth="4" style={{ width: "40px", height: "40px" }} />
    </div>
  );
}
