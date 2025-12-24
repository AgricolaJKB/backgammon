import {gameEvents} from '$lib/server/gameEvents';

/** @type {import('./$types').RequestHandler} */
export function GET({params}) {
    const {gameId} = params;

    let listener;
    let interval;

    const readable = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();

            const send = (data) => {
                try {
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
                    );
                } catch (e) {
                    // Controller might be closed
                }
            };

            listener = () => {
                send({type: 'update'});
            };

            gameEvents.on(`update:${gameId}`, listener);

            interval = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(': keepalive\n\n'));
                } catch (e) {
                    clearInterval(interval);
                }
            }, 15000);
        },
        cancel() {
            if (listener) gameEvents.off(`update:${gameId}`, listener);
            if (interval) clearInterval(interval);
        },
    });

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}
