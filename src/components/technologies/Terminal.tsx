export default function Terminal({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <title>Terminal</title>
        <path d="M6 9a0.5 0.5 0 0 1 0.5 -0.5h3a0.5 0.5 0 0 1 0 1h-3A0.5 0.5 0 0 1 6 9M3.854 4.146a0.5 0.5 0 1 0 -0.708 0.708L4.793 6.5 3.146 8.146a0.5 0.5 0 1 0 0.708 0.708l2 -2a0.5 0.5 0 0 0 0 -0.708z" />
        <path d="M2 1a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V3a2 2 0 0 0 -2 -2zm12 1a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1H2a1 1 0 0 1 -1 -1V3a1 1 0 0 1 1 -1z" />
      </svg>
    </div>
  );
}
