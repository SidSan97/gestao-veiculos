import { BACKEND_API_URL } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    const isMultipart = contentType.includes("multipart/form-data");
    const body = isMultipart ? await request.formData() : await request.text();

    const res = await fetch(`${BACKEND_API_URL}/veiculos`, {
      method: "POST",
      headers: isMultipart ? undefined : { "Content-Type": "application/json" },
      body: isMultipart ? body : body,
    });

    const json = await res.json().catch(() => ({
      message: "Resposta inválida do servidor.",
    }));

    return NextResponse.json(json, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível conectar ao servidor." },
      { status: 502 }
    );
  }
}
