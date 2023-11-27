export class ResultadoPartidoDTO {
    sets: Array<{
        marcador: string;
    }>;

    ganador: {
        tipo: 'jugador' | 'pareja';
        id: number;
        setsGanados: number;
        setsPerdidos: number;
        puntosSets: number;
    };


    perdedor: {
        tipo: 'jugador' | 'pareja';
        id: number;
        setsGanados: number;
        setsPerdidos: number;
        puntosSets: number;
    };
}
