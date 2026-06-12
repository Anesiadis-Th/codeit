export default function EmptyState({ icon: Icon, image, title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      {image ? (
        <img src={image} alt="" aria-hidden="true" className="w-28 opacity-90" />
      ) : (
        Icon && <Icon className="size-10 text-fg-muted" aria-hidden="true" />
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-fg-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
