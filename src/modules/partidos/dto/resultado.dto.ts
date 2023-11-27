export class ResultadoPartidoDTO {
    sets: Array<{
        marcador: string;
    }>;

    ganador: {
        tipo: 'jugador' | 'pareja';
        id: number;
    };
}
