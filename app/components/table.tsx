import styles from '../../css/table.module.css';
import Link from 'next/link';

type Car = {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  placa: string;
  multas: Array<{}>;
};

export default function Table({ cars }: { cars: Car[] }) {
  const list = Array.isArray(cars) ? cars : [];

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
                <td> <Link href={`/detalhes-veiculo/${car.placa}`}>{car.placa}</Link></td>
                <td>{car.marca}</td>
                <td>{car.modelo}</td>
                <td>{car.ano}</td>
                <td>{car.cor}</td>
                <td>{car.multas.length > 0 ? 'Sim' : 'Não'}</td>
                <td>
                  <button className="btn btn-primary"><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-danger ms-2"><i className="bi bi-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}