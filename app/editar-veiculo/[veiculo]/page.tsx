import CadastrarVeiculoForm, {
  type VeiculoEdit,
} from "@/app/cadastrar-veiculo/cadastrar-veiculo-form";
import Link from "next/link";

async function getVeiculo(placa: string): Promise<VeiculoEdit | undefined> {
  const res = await fetch(
    `http://localhost:8000/api/veiculos/placa/${placa}`,
    { cache: "no-store" }
  );

  if (!res.ok) return undefined;

  const json = await res.json();
  const items = json.data;
  return Array.isArray(items) ? items[0] : items;
}

export default async function EditarVeiculoPage(
  props: PageProps<"/editar-veiculo/[veiculo]">
) {
  const { veiculo: placa } = await props.params;
  const veiculo = await getVeiculo(placa);

  if (!veiculo) {
    return (
      <div className="container-fluid p-4" data-bs-theme="dark">
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

  return <CadastrarVeiculoForm veiculo={veiculo} />;
}
