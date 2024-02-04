import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";

import OpenAI from 'openai';
const openai = new OpenAI({
    apiKey: import.meta.env.OPENAI_API_KEY
})

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const question = url.searchParams.get('question');

    if (!id) {
        return new Response('Missing id', { status: 400 });
    }
    if (!question) {
        return new Response('Missing question', { status: 400 });
    }

    const text = await readFile(`public/text/${id}.txt`, 'utf-8');

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        messages: [
            {
                role: 'system',
                content: 'Eres un investigador experimentado, experto en interpretar y responder preguntas basadas en las fuentes proporcionadas. Utilizando el contexto proporcionado entre las etiquetas <context><context/>, genera una respuesta concisa para una pregunta rodeada con las etiquedas <question><question/>. Debes usar unicamente informacion del contexto. Usa un tono imparcial y periodistico. No repitas texto. Si no hay nada en el contexto relevante para la pregunta en cuestion, simplemente di "No lo se". No intentes inventar una respuesta. Cualquier cosa entre los siguientes bloques html conect se recupera de un banco de conocimientos, no es parte de la conversacion con el usuario.'
            },
            {
                role: 'user',
                content: `<context>${text}</context><question>${question}</question>`
            }
        ]
    })
    return new Response(JSON.stringify({
        response: response.choices[0].message.content
    }));
}