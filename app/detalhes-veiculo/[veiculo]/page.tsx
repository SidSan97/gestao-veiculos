import Link from "next/link";
import {
  formatPreco,
  formatKm,
  formatData,
  statusBadgeClass,
} from "@/utils";

type Multa = {
  id: number;
  descricao: string;
  valor: string;
  data: string;
  cidade: string;
  veiculo_id: number;
  status: string;
  observacoes: string | null;
};

type Veiculo = {
  id: number;
  marca: string;
  modelo: string;
  cor: string;
  ano: number;
  placa: string;
  estado: string;
  preco: string;
  km: number;
  transmissao: string;
  motor: string;
  observacoes: string | null;
  imagem: string | null;
  created_at: string;
  updated_at: string;
  multas: Multa[];
};

export async function getData(placa: string): Promise<Veiculo | undefined> {
  const res = await fetch(
    "http://localhost:8000/api/veiculos/placa/" + placa,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar veículo");
  }

  const json = await res.json();
  const items = json.data;
  return Array.isArray(items) ? items[0] : items;
}

export default async function DetalhesVeiculo(
  props: PageProps<"/detalhes-veiculo/[veiculo]">
) {
  const { veiculo } = await props.params;
  const car = await getData(veiculo);

  if (!car) {
    return (
      <div className="container-fluid mt-3" data-bs-theme="dark">
        <div className="alert alert-warning d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill" />
          <span>Veículo não encontrado.</span>
        </div>
        <Link href="/" className="btn btn-outline-light">
          <i className="bi bi-arrow-left me-1" />
          Voltar à lista
        </Link>
      </div>
    );
  }

  const multas = Array.isArray(car.multas) ? car.multas : [];

  return (
    <div className="container-fluid mt-3 pb-4" data-bs-theme="dark">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <div>
          <Link
            href="/"
            className="btn btn-sm btn-outline-secondary mb-2"
          >
            <i className="bi bi-arrow-left me-1" />
            Voltar
          </Link>
          <h1 className="h3 mb-0">
            {car.marca} {car.modelo}
          </h1>
          <p className="mb-0 small">
            Placa <span className="font-monospace">{car.placa}</span> · ID #{car.id}
          </p>
        </div>
        <div className="text-end">
          <span className="badge text-bg-primary fs-6 px-3 py-2">
            {formatPreco(car.preco)}
          </span>
          <div className="mt-2">
            <span className="badge text-bg-secondary text-capitalize">
              {car.estado}
            </span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-secondary h-100">
            <div className="card-body d-flex flex-column align-items-center justify-content-center text-center py-5">
              {car.imagem ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={car.imagem}
                  alt={`${car.marca} ${car.modelo}`}
                  className="img-fluid rounded"
                />
              ) : (
                <>
                  <i className="bi bi-car-front display-1 text-secondary" />
                  <p className="text-secondary small mb-0 mt-3">
                    Sem imagem cadastrada
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-secondary h-100">
            <div className="card-header bg-transparent border-secondary">
              <i className="bi bi-info-circle me-2" />
              Informações do veículo
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-sm-6 col-md-4">
                  <div className="border border-secondary rounded p-3 h-100">
                    <div className="small">Ano</div>
                    <div className="fw-semibold">{car.ano}</div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="border border-secondary rounded p-3 h-100">
                    <div className=" small">Cor</div>
                    <div className="fw-semibold">{car.cor}</div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="border border-secondary rounded p-3 h-100">
                    <div className="small">Quilometragem</div>
                    <div className="fw-semibold">{formatKm(car.km)}</div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="border border-secondary rounded p-3 h-100">
                    <div className="small">Transmissão</div>
                    <div className="fw-semibold">{car.transmissao}</div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-8">
                  <div className="border border-secondary rounded p-3 h-100">
                    <div className="small">Motor</div>
                    <div className="fw-semibold">{car.motor}</div>
                  </div>
                </div>
              </div>

              {car.observacoes && (
                <div className="alert alert-secondary mt-3 mb-0 small">
                  <i className="bi bi-chat-left-text me-2" />
                  <strong>Observações:</strong> {car.observacoes}
                </div>
              )}

              <hr className="border-secondary my-3" />

              <div className="row small">
                <div className="col-md-6">
                  <i className="bi bi-calendar-plus me-1" />
                  Cadastro: {formatData(car.created_at)}
                </div>
                <div className="col-md-6 mt-1 mt-md-0">
                  <i className="bi bi-calendar-check me-1" />
                  Atualizado: {formatData(car.updated_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-secondary mt-4">
        <div className="card-header bg-transparent border-secondary d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span>
            <i className="bi bi-exclamation-octagon me-2" />
            Multas
          </span>
          <span className="badge text-bg-dark">
            {multas.length} {multas.length === 1 ? "registro" : "registros"}
          </span>
        </div>
        <div className="card-body p-0">
          {multas.length === 0 ? (
            <div className="p-4 text-center text-secondary">
              <i className="bi bi-check-circle display-6 d-block mb-2" />
              Nenhuma multa registrada para este veículo.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0 align-middle">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Descrição</th>
                    <th scope="col">Cidade</th>
                    <th scope="col">Data</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {multas.map((multa) => (
                    <tr key={multa.id}>
                      <th scope="row">{multa.id}</th>
                      <td>
                        {multa.descricao}
                        {multa.observacoes && (
                          <div className="small text-secondary mt-1">
                            {multa.observacoes}
                          </div>
                        )}
                      </td>
                      <td>{multa.cidade}</td>
                      <td>{formatData(multa.data)}</td>
                      <td className="text-nowrap">
                        {formatPreco(multa.valor)}
                      </td>
                      <td>
                        <span
                          className={`badge ${statusBadgeClass(multa.status)} text-capitalize`}
                        >
                          {multa.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
