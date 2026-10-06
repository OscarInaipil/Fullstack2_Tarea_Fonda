import { Container } from "react-bootstrap";

const BANDERINES = Array.from({ length: 40 }, (_, i) => i);

export default function Encabezado() {
  return (
    <header className="encabezado mb-4">
      <div className="banderines" aria-hidden="true">
        {BANDERINES.map((i) => (
          <span key={i} />
        ))}
      </div>
      <Container className="pt-3 pb-2">
        <h1 className="encabezado-titulo mb-1">Fonda San Belarmino</h1>
        <p className="mb-0 text-body-secondary">Bebidas, stock y ventas de la ramada</p>
      </Container>
    </header>
  );
}
