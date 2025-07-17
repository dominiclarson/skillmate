

export function SkillDisplay({ activeSection }) {
  if (!activeSection) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Select a skill to view details</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3>{activeSection.description}</h3>
    </div>
  );
}