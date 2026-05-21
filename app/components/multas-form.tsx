"use client";

const MULTA_STATUS = [
  { value: "pendente", label: "Pendente" },
  { value: "paga", label: "Paga" },
  { value: "cancelada", label: "Cancelada" },
] as const;

export type MultaFormState = {
  id: string;
  backendId?: number;
  descricao: string;
  valor: string;
  data: string;
  cidade: string;
  status: string;
  observacoes: string;
  imagem: File | null;
};

export type MultaPayload = {
  id?: number;
  descricao: string;
  valor: string;
  data: string;
  cidade: string;
  status: string;
  observacoes: string | null;
};

export type MultaApi = {
  id: number;
  descricao: string;
  valor: string;
  data: string;
  cidade: string;
  status: string;
  observacoes: string | null;
};

export function multaFromApi(multa: MultaApi): MultaFormState {
  const data = multa.data.includes("T")
    ? multa.data.slice(0, 10)
    : multa.data.split(" ")[0];

  return {
    id: `multa-${multa.id}`,
    backendId: multa.id,
    descricao: multa.descricao,
    valor: String(multa.valor),
    data,
    cidade: multa.cidade,
    status: multa.status,
    observacoes: multa.observacoes ?? "",
    imagem: null,
  };
}

export function createMulta(): MultaFormState {
  return {
    id: crypto.randomUUID(),
    descricao: "",
    valor: "",
    data: "",
    cidade: "",
    status: "pendente",
    observacoes: "",
    imagem: null,
  };
}

export function multaHasContent(m: MultaFormState) {
  return (
    m.descricao.trim() ||
    m.valor.trim() ||
    m.data ||
    m.cidade.trim() ||
    m.observacoes.trim() ||
    m.imagem
  );
}

export function buildMultasPayload(
  list: MultaFormState[],
  options?: { withIds?: boolean }
): MultaPayload[] {
  return list
    .filter((m) => m.descricao.trim())
    .map((m) => ({
      ...(options?.withIds && m.backendId != null ? { id: m.backendId } : {}),
      descricao: m.descricao.trim(),
      valor: m.valor.trim(),
      data: m.data,
      cidade: m.cidade.trim(),
      status: m.status,
      observacoes: m.observacoes.trim() || null,
    }));
}

export function validateMultas(list: MultaFormState[]): string | null {
  const incomplete = list.filter(
    (m) => multaHasContent(m) && !m.descricao.trim()
  );
  if (incomplete.length > 0) {
    return "Preencha a descrição em todas as multas ou remova as linhas vazias.";
  }

  const comConteudo = list.filter(multaHasContent);
  const invalida = comConteudo.find(
    (m) =>
      !m.descricao.trim() ||
      !m.valor.trim() ||
      !m.data ||
      !m.cidade.trim()
  );
  if (invalida) {
    return "Cada multa precisa de descrição, valor, data e cidade.";
  }

  return null;
}

export function multasNeedMultipart(list: MultaFormState[]) {
  return list.some((m) => m.imagem);
}

export function appendMultasToFormData(
  body: FormData,
  list: MultaFormState[],
  payloads: MultaPayload[]
) {
  payloads.forEach((multa, index) => {
    Object.entries(multa).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        body.append(`multas[${index}][${key}]`, String(value));
      }
    });
    const file = list.filter((m) => m.descricao.trim())[index]?.imagem;
    if (file) {
      body.append(`multas[${index}][imagem]`, file);
    }
  });
}

type MultasFormProps = {
  multas: MultaFormState[];
  onChange: (multas: MultaFormState[]) => void;
};

export default function MultasForm({ multas, onChange }: MultasFormProps) {
  function updateMulta<K extends keyof MultaFormState>(
    id: string,
    key: K,
    value: MultaFormState[K]
  ) {
    onChange(multas.map((m) => (m.id === id ? { ...m, [key]: value } : m)));
  }

  function addMulta() {
    onChange([...multas, createMulta()]);
  }

  function removeMulta(id: string) {
    onChange(multas.filter((m) => m.id !== id));
  }

  return (
    <div className="col-12">
      <div className="card border-secondary">
        <div className="card-header bg-transparent border-secondary d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span>
            <i className="bi bi-exclamation-octagon me-2" />
            Multas
          </span>
          <div className="d-flex align-items-center gap-2">
            <span className="badge text-bg-dark">
              {multas.length}{" "}
              {multas.length === 1 ? "registro" : "registros"}
            </span>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={addMulta}
            >
              <i className="bi bi-plus-lg me-1" />
              Adicionar multa
            </button>
          </div>
        </div>
        <div className="card-body">
          {multas.length === 0 ? (
            <p className="text-body-secondary small mb-0 text-center py-3">
              <i className="bi bi-check-circle d-block fs-3 mb-2" />
              Nenhuma multa adicionada. Use o botão acima para incluir.
            </p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {multas.map((multa, index) => (
                <div
                  key={multa.id}
                  className="border border-secondary rounded p-3"
                >
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                    <span className="fw-semibold small">
                      Multa #{index + 1}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeMulta(multa.id)}
                      aria-label={`Remover multa ${index + 1}`}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                  <div className="row g-3">
                    <div className="col-12">
                      <label
                        htmlFor={`multa-descricao-${multa.id}`}
                        className="form-label"
                      >
                        Descrição <span className="text-danger">*</span>
                      </label>
                      <input
                        id={`multa-descricao-${multa.id}`}
                        type="text"
                        className="form-control"
                        maxLength={255}
                        value={multa.descricao}
                        onChange={(e) =>
                          updateMulta(multa.id, "descricao", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label
                        htmlFor={`multa-valor-${multa.id}`}
                        className="form-label"
                      >
                        Valor (R$) <span className="text-danger">*</span>
                      </label>
                      <input
                        id={`multa-valor-${multa.id}`}
                        type="number"
                        className="form-control"
                        min={0}
                        step="0.01"
                        value={multa.valor}
                        onChange={(e) =>
                          updateMulta(multa.id, "valor", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label
                        htmlFor={`multa-data-${multa.id}`}
                        className="form-label"
                      >
                        Data <span className="text-danger">*</span>
                      </label>
                      <input
                        id={`multa-data-${multa.id}`}
                        type="date"
                        className="form-control"
                        value={multa.data}
                        onChange={(e) =>
                          updateMulta(multa.id, "data", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label
                        htmlFor={`multa-status-${multa.id}`}
                        className="form-label"
                      >
                        Status <span className="text-danger">*</span>
                      </label>
                      <select
                        id={`multa-status-${multa.id}`}
                        className="form-select"
                        value={multa.status}
                        onChange={(e) =>
                          updateMulta(multa.id, "status", e.target.value)
                        }
                      >
                        {MULTA_STATUS.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor={`multa-cidade-${multa.id}`}
                        className="form-label"
                      >
                        Cidade <span className="text-danger">*</span>
                      </label>
                      <input
                        id={`multa-cidade-${multa.id}`}
                        type="text"
                        className="form-control"
                        maxLength={100}
                        value={multa.cidade}
                        onChange={(e) =>
                          updateMulta(multa.id, "cidade", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor={`multa-imagem-${multa.id}`}
                        className="form-label"
                      >
                        Imagem da multa
                      </label>
                      <input
                        id={`multa-imagem-${multa.id}`}
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) =>
                          updateMulta(
                            multa.id,
                            "imagem",
                            e.target.files?.[0] ?? null
                          )
                        }
                      />
                      {multa.imagem && (
                        <p className="small text-body-secondary mt-1 mb-0">
                          {multa.imagem.name}
                        </p>
                      )}
                    </div>
                    <div className="col-12">
                      <label
                        htmlFor={`multa-obs-${multa.id}`}
                        className="form-label"
                      >
                        Observações
                      </label>
                      <textarea
                        id={`multa-obs-${multa.id}`}
                        className="form-control"
                        rows={2}
                        maxLength={500}
                        value={multa.observacoes}
                        onChange={(e) =>
                          updateMulta(
                            multa.id,
                            "observacoes",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
