// Utilitário compartilhado: faz o parse do corpo JSON da requisição de forma segura.
// Sem isso, um corpo ausente ou malformado (ex: uma requisição de teste sem -d/--data)
// faz `c.req.json()` lançar uma exceção que cai no handler genérico de erro (500
// "Erro interno do servidor") — uma mensagem assustadora para um problema simples
// de requisição incompleta. Com este helper, a rota devolve um 400 claro e específico.
export async function parseBody(c) {
  try {
    return await c.req.json();
  } catch {
    return null;
  }
}

// Uso em uma rota:
//   const body = await parseBody(c);
//   if (!body) return c.json({ error: 'Corpo da requisição inválido. Envie um JSON válido no corpo (Content-Type: application/json).' }, 400);
export const INVALID_BODY_ERROR = 'Corpo da requisição inválido. Envie um JSON válido no corpo (Content-Type: application/json).';
