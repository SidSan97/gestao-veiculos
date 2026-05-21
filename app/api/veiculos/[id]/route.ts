import { BACKEND_API_URL } from "@/lib/backend";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { message: "ID do veículo inválido." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${BACKEND_API_URL}/veiculos/${id}`, {
      method: "DELETE",
    });

    const body = await res.json().catch(() => ({
      message: "Resposta inválida do servidor.",
    }));

    return NextResponse.json(body, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível conectar ao servidor." },
      { status: 502 }
    );
  }
}
