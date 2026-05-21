"use client";

import styles from "../../css/table.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

type Car = {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  placa: string;
  multas: Array<unknown>;
};

export default function Table({ cars }: { cars: Car[] }) {
  const router = useRouter();
  const list = Array.isArray(cars) ? cars : [];
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(car: Car) {
    const { isConfirmed } = await Swal.fire({
      title: "Excluir veículo?",
      html: `<strong>${car.marca} ${car.modelo}</strong><br>Placa <span class="font-monospace">${car.placa}</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
    });

    if (!isConfirmed) return;

    setDeletingId(car.id);

    try {
      const res = await fetch(`/api/veiculos/${car.id}`, { method: "DELETE" });

      if (!res.ok) {
        let message = "Não foi possível excluir o veículo.";
        try {
          const json = await res.json();
          if (typeof json.message === "string") message = json.message;
        } catch {
          /* resposta não JSON */
        }
        throw new Error(message);
      }

      await Swal.fire({
        icon: "success",
        title: "Veículo excluído",
        text: `${car.placa} removido da lista.`,
        timer: 2000,
        showConfirmButton: false,
      });

      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir o veículo.";
      await Swal.fire({
        icon: "error",
        title: "Falha na exclusão",
        text: message,
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="container-fluid mt-3">
      <h1 className="h3 mb-2">Lista de Veículos</h1>

      <div className="table-responsive">
        <table className={`table ${styles.tableCustom}`} data-bs-theme="dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Placa</th>
              <th scope="col">Marca</th>
              <th scope="col">Modelo</th>
              <th scope="col">Ano</th>
              <th scope="col">Cor</th>
              <th scope="col">Multas</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((car) => (
              <tr key={car.id}>
                <th scope="row">{car.id}</th>
                <td>
                  <Link href={`/detalhes-veiculo/${car.placa}`}>
                    {car.placa}
                  </Link>
                </td>
                <td>{car.marca}</td>
                <td>{car.modelo}</td>
                <td>{car.ano}</td>
                <td>{car.cor}</td>
                <td>{car.multas.length > 0 ? "Sim" : "Não"}</td>
                <td className="text-nowrap">
                  <button
                    type="button"
                    className="btn btn-primary"
                    title="Editar"
                    aria-label={`Editar ${car.placa}`}
                  >
                    <i className="bi bi-pencil" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    title="Excluir"
                    aria-label={`Excluir ${car.placa}`}
                    disabled={deletingId === car.id}
                    onClick={() => handleDelete(car)}
                  >
                    {deletingId === car.id ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      <i className="bi bi-trash" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
