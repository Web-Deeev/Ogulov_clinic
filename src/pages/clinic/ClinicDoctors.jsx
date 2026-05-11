const doctors = [
  { id: 1, name: "Огулов А.Т.", role: "Основатель центра" },
  { id: 2, name: "Иванов И.И.", role: "Специалист по висцеральной практике" },
];

export default function ClinicDoctors() {
  return (
    <section className="clinic-doctors">
      <h1>Наши специалисты</h1>
      <div className="doctors-grid">
        {doctors.map(doc => (
          <div key={doc.id} className="doctor-card">
            <h3>{doc.name}</h3>
            <p>{doc.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
