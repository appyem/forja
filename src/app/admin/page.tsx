export default function AdminDashboardPage() {
  const metrics = [
    { title: "Ventas Totales", value: "$ 0 COP" },
    { title: "Pedidos Pendientes", value: "0" },
    { title: "Productos Activos", value: "0" },
    { title: "Usuarios Registrados", value: "0" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-purple-900">Dashboard</h1>
      <p className="mt-2 text-brand-neutral-600">
        Bienvenido al panel de administración de FORJA.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="rounded-xl border border-brand-neutral-200 bg-white p-6 shadow-soft"
          >
            <p className="text-sm font-medium text-brand-neutral-500">{metric.title}</p>
            <p className="mt-2 text-3xl font-bold text-brand-purple-900">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-bold text-brand-purple-900">Actividad Reciente</h2>
        <p className="mt-2 text-sm text-brand-neutral-500">
          No hay actividad reciente para mostrar. Las métricas se conectarán a Firestore en los siguientes pasos.
        </p>
      </div>
    </div>
  );
}