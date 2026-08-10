export default function AgentSkills({ className }: { className?: string }) {
  return (
    <div className={className} style={{ color: "#000000" }}>
      {/* Path from Simple Icons (Agent Skills / agentskills) */}
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="size-full dark:invert"
      >
        <title>Agent Skills</title>
        <path d="m12 0 10.392 6v12L12 24 1.608 18V6Z" />
      </svg>
    </div>
  );
}
