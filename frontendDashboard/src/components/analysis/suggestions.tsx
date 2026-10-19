interface SuggestionsProps {
  suggestions: string[];
}

export function Suggestions({ suggestions }: SuggestionsProps) {
  return (
    <section className="card-section">
      <h2>Suggestions</h2>
      {suggestions.length === 0 ? (
        <p className="text-secondary">No additional suggestions available.</p>
      ) : (
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          {suggestions.map((suggestion) => (
            <li key={suggestion} style={{ marginBottom: 8 }}>
              {suggestion}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
