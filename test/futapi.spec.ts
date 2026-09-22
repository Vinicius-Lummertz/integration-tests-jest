import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Futebol API', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://apifutsimples.onrender.com';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('HEALTH CHECK', () => {
    it('deve verificar se a API está funcionando', async () => {
      await p
        .spec()
        .get(`${baseUrl}/health`)
        .expectStatus(StatusCodes.OK);
    });
  });

  describe('JOGADORES', () => {
    it('deve listar todos os jogadores', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/jogadores`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          total: 6
        });
    });

    it('deve listar jogadores filtrando por time', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/jogadores`)
        .withQueryParams('time', 'Corinthians')
        .expectStatus(StatusCodes.OK);
    });

    it('deve listar jogadores filtrando por posição', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/jogadores`)
        .withQueryParams('posicao', 'Atacante')
        .expectStatus(StatusCodes.OK);
    });

    it('deve criar um novo jogador', async () => {
      await p
        .spec()
        .post(`${baseUrl}/api/jogadores`)
        .withJson({
          nome: 'Gabriel Teste',
          posicao: 'Atacante',
          time: 'Santos',
          numero_camisa: 99,
          idade: 25,
          gols: 5
        })
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          nome: 'Gabriel Teste',
          posicao: 'Atacante',
          time: 'Santos',
          numero_camisa: 99,
          idade: 25,
          gols: 5
        });
    });

    it('deve buscar um jogador por id', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/jogadores/1`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: 1,
          nome: 'Pedro Silva'
        });
    });

    it('deve retornar 404 ao buscar jogador inexistente', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/jogadores/99999`)
        .expectStatus(StatusCodes.NOT_FOUND)
        .expectJsonLike({
          erro: 'Jogador não encontrado'
        });
    });

    it('deve atualizar um jogador', async () => {
      await p
        .spec()
        .put(`${baseUrl}/api/jogadores/6`)
        .withJson({
          nome: 'Neymar',
          posicao: 'Atacante',
          time: 'Santos',
          numero_camisa: 10,
          idade: 34,
          gols: 15
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: 6,
          nome: 'Neymar',
          posicao: 'Atacante',
          time: 'Santos',
          numero_camisa: 10,
          idade: 34,
          gols: 15
        });
    });

    it('deve retornar 400 ao criar jogador sem campos obrigatórios', async () => {
      await p
        .spec()
        .post(`${baseUrl}/api/jogadores`)
        .withJson({
          nome: 'Jogador sem time'
        })
        .expectStatus(StatusCodes.BAD_REQUEST);
    });
  });

  describe('ESTADIOS', () => {
    it('deve listar todos os estádios', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/estadios`)
        .expectStatus(StatusCodes.OK);
    });

    it('deve filtrar estádios por cidade', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/estadios`)
        .withQueryParams('cidade', 'São Paulo')
        .expectStatus(StatusCodes.OK);
    });

    it('deve filtrar estádios por capacidade mínima', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/estadios`)
        .withQueryParams('capacidade_min', 40000)
        .expectStatus(StatusCodes.OK);
    });

    it('deve criar um novo estádio', async () => {
      await p
        .spec()
        .post(`${baseUrl}/api/estadios`)
        .withJson({
          nome: 'Estádio de Teste',
          cidade: 'São Paulo',
          capacidade: 50000,
          ano_inauguracao: 2026
        })
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          nome: 'Estádio de Teste',
          cidade: 'São Paulo',
          capacidade: 50000,
          ano_inauguracao: 2026
        });
    });

    it('deve buscar um estádio por id', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/estadios/1`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: 1
        });
    });

    it('deve retornar 404 ao buscar estádio inexistente', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/estadios/99999`)
        .expectStatus(StatusCodes.NOT_FOUND);
    });

    it('deve atualizar um estádio', async () => {
      await p
        .spec()
        .put(`${baseUrl}/api/estadios/1`)
        .withJson({
          capacidade: 60000
        })
        .expectStatus(StatusCodes.OK);
    });

    it('deve retornar 400 ao criar estádio sem campos obrigatórios', async () => {
      await p
        .spec()
        .post(`${baseUrl}/api/estadios`)
        .withJson({
          nome: 'Estádio inválido'
        })
        .expectStatus(StatusCodes.BAD_REQUEST);
    });
  });

  describe('PARTIDAS', () => {
    it('deve listar todas as partidas', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/partidas`)
        .expectStatus(StatusCodes.OK);
    });

    it('deve filtrar partidas por status', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/partidas`)
        .withQueryParams('status', 'encerrada')
        .expectStatus(StatusCodes.OK);
    });

    it('deve filtrar partidas por time', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/partidas`)
        .withQueryParams('time', 'Flamengo')
        .expectStatus(StatusCodes.OK);
    });

    it('deve criar uma nova partida', async () => {
      await p
        .spec()
        .post(`${baseUrl}/api/partidas`)
        .withJson({
          time_casa: 'Flamengo',
          time_visitante: 'Palmeiras',
          data_partida: '2026-10-01',
          estadio_id: 1,
          gols_casa: 2,
          gols_visitante: 1,
          status: 'encerrada'
        })
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          time_casa: 'Flamengo',
          time_visitante: 'Palmeiras',
          gols_casa: 2,
          gols_visitante: 1,
          status: 'encerrada'
        });
    });

    it('deve buscar uma partida por id', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/partidas/1`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: 1
        });
    });

    it('deve retornar 404 ao buscar partida inexistente', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/partidas/99999`)
        .expectStatus(StatusCodes.NOT_FOUND);
    });

    it('deve atualizar uma partida', async () => {
      await p
        .spec()
        .put(`${baseUrl}/api/partidas/1`)
        .withJson({
          time_casa: 'Flamengo',
          time_visitante: 'Palmeiras',
          data_partida: '2026-10-01',
          estadio_id: 1,
          gols_casa: 3,
          gols_visitante: 1,
          status: 'encerrada'
        })
        .expectStatus(StatusCodes.OK);
    });

    it('deve atualizar somente o placar da partida', async () => {
      await p
        .spec()
        .put(`${baseUrl}/api/partidas/1/placar`)
        .withJson({
          gols_casa: 2,
          gols_visitante: 1,
          status: 'encerrada'
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          gols_casa: 2,
          gols_visitante: 1,
          status: 'encerrada'
        });
    });

    it('deve retornar 400 ao criar partida sem campos obrigatórios', async () => {
      await p
        .spec()
        .post(`${baseUrl}/api/partidas`)
        .withJson({
          time_casa: 'Flamengo'
        })
        .expectStatus(StatusCodes.BAD_REQUEST);
    });
  });
});
