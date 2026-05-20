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
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Ano</th>
          <th>Cor</th>
          <th>Placa</th>
          <th>Multas</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {list.map((car) => (
          <tr key={car.id}>
            <td>{car.id}</td>
            <td>{car.marca}</td>
            <td>{car.modelo}</td>
            <td>{car.ano}</td>
            <td>{car.cor}</td>
            <td>{car.placa}</td>
            <td>{car.multas.length > 0 ? 'Sim' : 'Não'}</td>
            <td>
              <button>Editar</button>
              <button>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}