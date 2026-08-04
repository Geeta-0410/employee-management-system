interface Props {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

function PageHeader({
  title,
  subtitle,
  action,
}: Props) {
  return (
    <div
      className="
        sticky
        top-16
        z-30
        bg-slate-700
        rounded-3xl
        shadow-lg
        px-8
        py-6
        mb-6
      "
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">
            {title}
          </h1>

          <p className="text-slate-200 mt-1">
            {subtitle}
          </p>
        </div>

        {action}
      </div>
    </div>
  );
}

export default PageHeader;