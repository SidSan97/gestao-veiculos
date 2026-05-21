"use client";

import MultasForm, {
  type MultaApi,
  type MultaFormState,
  appendMultasToFormData,
  buildMultasPayload,
  multaFromApi,
  multasNeedMultipart,
  validateMultas,
} from "@/app/components/multas-form";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Swal from "sweetalert2";

const API_URL = "/api/veiculos";

const ESTADOS = [
  { value: "novo", label: "Novo" },
  { value: "semi-novo", label: "Semi-novo" },
  { value: "usado", label: "Usado" },
] as const;

type VeiculoPayload = {
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
};

type FormState = {
  marca: string;
  modelo: string;
  cor: string;
  ano: string;
  placa: string;
  estado: string;
  preco: string;
  km: string;
  transmissao: string;
  motor: string;
  observacoes: string;
};

const initialState: FormState = {
  marca: "",
  modelo: "",
  cor: "",
  ano: "",
  placa: "",
  estado: "semi-novo",
  preco: "",
  km: "",
  transmissao: "",
  motor: "",
  observacoes: "",
};

export type VeiculoEdit = {
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
  multas?: MultaApi[];
};

function veiculoToFormState(veiculo: VeiculoEdit): FormState {
  return {
    marca: veiculo.marca,
    modelo: veiculo.modelo,
    cor: veiculo.cor,
    ano: String(veiculo.ano),
    placa: veiculo.placa,
    estado: veiculo.estado,
    preco: veiculo.preco,
    km: String(veiculo.km),
    transmissao: veiculo.transmissao,
    motor: veiculo.motor,
    observacoes: veiculo.observacoes ?? "",
  };
}

function appendVeiculoToFormData(body: FormData, payload: VeiculoPayload) {
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      body.append(key, String(value));
    }
  });
}

type CadastrarVeiculoFormProps = {
  veiculo?: VeiculoEdit;
};

export default function CadastrarVeiculoForm({
  veiculo,
}: CadastrarVeiculoFormProps) {
  const router = useRouter();
  const isEdit = Boolean(veiculo);
  const [form, setForm] = useState<FormState>(() =>
    veiculo ? veiculoToFormState(veiculo) : initialState
  );
  const [imagem, setImagem] = useState<File | null>(null);
  const [multas, setMultas] = useState<MultaFormState[]>(() =>
    veiculo?.multas?.map(multaFromApi) ?? []
  );
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const multasError = validateMultas(multas);
    if (multasError) {
      await Swal.fire({
        icon: "warning",
        title: "Multas incompletas",
        text: multasError,
      });
      return;
    }

    setSubmitting(true);

    const placa = form.placa.trim().toUpperCase();
    const payload: VeiculoPayload = {
      marca: form.marca.trim(),
      modelo: form.modelo.trim(),
      cor: form.cor.trim(),
      ano: Number(form.ano),
      placa,
      estado: form.estado,
      preco: form.preco.trim(),
      km: Number(form.km),
      transmissao: form.transmissao.trim(),
      motor: form.motor.trim(),
      observacoes: form.observacoes.trim() || null,
    };

    const multasPayload = buildMultasPayload(multas, { withIds: isEdit });
    const useMultipart = Boolean(imagem) || multasNeedMultipart(multas);

    try {
      let res: Response;

      if (isEdit && veiculo) {
        const url = `${API_URL}/${veiculo.id}`;

        if (useMultipart) {
          const body = new FormData();
          appendVeiculoToFormData(body, payload);
          if (imagem) body.append("imagem", imagem);
          appendMultasToFormData(body, multas, multasPayload);
          res = await fetch(url, { method: "PUT", body });
        } else {
          res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...payload,
              multas: multasPayload,
            }),
          });
        }
      } else if (useMultipart) {
        const body = new FormData();
        appendVeiculoToFormData(body, payload);
        if (imagem) body.append("imagem", imagem);
        appendMultasToFormData(body, multas, multasPayload);
        res = await fetch(API_URL, { method: "POST", body });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            ...(multasPayload.length > 0 ? { multas: multasPayload } : {}),
          }),
        });
      }

      if (!res.ok) {
        let message = isEdit
          ? "Não foi possível atualizar o veículo."
          : "Não foi possível cadastrar o veículo.";
        try {
          const json = await res.json();
          if (typeof json.message === "string") message = json.message;
        } catch {
          /* resposta não JSON */
        }
        throw new Error(message);
      }

      const multasMsg =
        multasPayload.length > 0
          ? ` · ${multasPayload.length} multa(s)`
          : "";

      await Swal.fire({
        icon: "success",
        title: isEdit ? "Veículo atualizado" : "Veículo cadastrado",
        text: `${payload.marca} ${payload.modelo} (${placa})${multasMsg}`,
        confirmButtonText: "Ver detalhes",
      });

      router.push(`/detalhes-veiculo/${placa}`);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : isEdit
            ? "Erro ao atualizar o veículo."
            : "Erro ao cadastrar o veículo.";
      await Swal.fire({
        icon: "error",
        title: isEdit ? "Falha na edição" : "Falha no cadastro",
        text: message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-fluid p-4 pb-5" data-bs-theme="dark">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <div>
          <Link href="/" className="btn btn-sm btn-outline-secondary mb-2">
            <i className="bi bi-arrow-left me-1" />
            Voltar
          </Link>
          <h1 className="h3 mb-0">
            {isEdit ? "Editar veículo" : "Cadastrar veículo"}
          </h1>
          <p className="text-body-secondary small mb-0">
            {isEdit
              ? `Alterando ${veiculo?.marca} ${veiculo?.modelo} · placa ${veiculo?.placa}`
              : "Preencha os dados do veículo para incluí-lo na frota."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="row g-4">
        <div className="col-lg-8">
          <div className="card border-secondary">
            <div className="card-header bg-transparent border-secondary">
              <i className="bi bi-car-front me-2" />
              Dados do veículo
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="marca" className="form-label">
                    Marca <span className="text-danger">*</span>
                  </label>
                  <input
                    id="marca"
                    type="text"
                    className="form-control"
                    required
                    maxLength={100}
                    value={form.marca}
                    onChange={(e) => updateField("marca", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="modelo" className="form-label">
                    Modelo <span className="text-danger">*</span>
                  </label>
                  <input
                    id="modelo"
                    type="text"
                    className="form-control"
                    required
                    maxLength={100}
                    value={form.modelo}
                    onChange={(e) => updateField("modelo", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="placa" className="form-label">
                    Placa <span className="text-danger">*</span>
                  </label>
                  <input
                    id="placa"
                    type="text"
                    className="form-control font-monospace text-uppercase"
                    required
                    minLength={7}
                    maxLength={9}
                    pattern="[A-Za-z]{3}[0-9][A-Za-z0-9][0-9]{2}"
                    title="Placa no padrão Mercosul (ex.: ABC1D23)"
                    value={form.placa}
                    readOnly={isEdit}
                    onChange={(e) =>
                      updateField("placa", e.target.value.toUpperCase())
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="ano" className="form-label">
                    Ano <span className="text-danger">*</span>
                  </label>
                  <input
                    id="ano"
                    type="number"
                    className="form-control"
                    required
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    value={form.ano}
                    onChange={(e) => updateField("ano", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="cor" className="form-label">
                    Cor <span className="text-danger">*</span>
                  </label>
                  <input
                    id="cor"
                    type="text"
                    className="form-control"
                    required
                    maxLength={50}
                    value={form.cor}
                    onChange={(e) => updateField("cor", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="estado" className="form-label">
                    Estado <span className="text-danger">*</span>
                  </label>
                  <select
                    id="estado"
                    className="form-select"
                    required
                    value={form.estado}
                    onChange={(e) => updateField("estado", e.target.value)}
                  >
                    {ESTADOS.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="preco" className="form-label">
                    Preço (R$) <span className="text-danger">*</span>
                  </label>
                  <input
                    id="preco"
                    type="number"
                    className="form-control"
                    required
                    min={0}
                    step="0.01"
                    value={form.preco}
                    onChange={(e) => updateField("preco", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="km" className="form-label">
                    Quilometragem <span className="text-danger">*</span>
                  </label>
                  <input
                    id="km"
                    type="number"
                    className="form-control"
                    required
                    min={0}
                    step="0.1"
                    value={form.km}
                    onChange={(e) => updateField("km", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="transmissao" className="form-label">
                    Transmissão <span className="text-danger">*</span>
                  </label>
                  <input
                    id="transmissao"
                    type="text"
                    className="form-control"
                    required
                    maxLength={100}
                    placeholder="Ex.: Automática"
                    value={form.transmissao}
                    onChange={(e) =>
                      updateField("transmissao", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="motor" className="form-label">
                    Motor <span className="text-danger">*</span>
                  </label>
                  <input
                    id="motor"
                    type="text"
                    className="form-control"
                    required
                    maxLength={100}
                    placeholder="Ex.: 1.6 16V flex"
                    value={form.motor}
                    onChange={(e) => updateField("motor", e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="observacoes" className="form-label">
                    Observações
                  </label>
                  <textarea
                    id="observacoes"
                    className="form-control"
                    rows={3}
                    maxLength={500}
                    value={form.observacoes}
                    onChange={(e) =>
                      updateField("observacoes", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-secondary h-100">
            <div className="card-header bg-transparent border-secondary">
              <i className="bi bi-image me-2" />
              Imagem
            </div>
            <div className="card-body d-flex flex-column">
              <label htmlFor="imagem" className="form-label">
                Foto do veículo
              </label>
              <input
                id="imagem"
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) =>
                  setImagem(e.target.files?.[0] ?? null)
                }
              />
              <p className="small text-body-secondary mt-2 mb-0">
                Opcional. Formatos de imagem comuns (JPG, PNG, WebP).
              </p>
              {imagem && (
                <p className="small mt-2 mb-0">
                  <i className="bi bi-paperclip me-1" />
                  {imagem.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <MultasForm multas={multas} onChange={setMultas} />

        <div className="d-flex gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Salvando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-1" />
                  {isEdit ? "Salvar alterações" : "Cadastrar veículo"}
                </>
              )}
            </button>
            <Link href="/" className="btn btn-outline-secondary">
              Cancelar
            </Link>
          </div>
      </form>
    </div>
  );
}
