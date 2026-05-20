import Table from "./components/table";

export async function getData() {
  const res = await fetch("http://localhost:8000/api/veiculos", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar veículos");
  }

  const json = await res.json();
  return json.data;
}

export default async function Home() {
  const cars = await getData();

  return (
    <>
      <Table cars={cars} />
    </>
  );
}
