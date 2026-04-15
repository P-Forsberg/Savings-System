interface PageShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function PageShell({ title, subtitle, children, action }: PageShellProps) {
  return (
    <div className="page-shell">
      <header className="page-header">
        <div className="page-header-inner">
          <div>
            <h1 className="page-title">{title}</h1>
            {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      </header>
      <main className="page-main">{children}</main>
    </div>
  );
}
