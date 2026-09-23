// Cadastro de nomes próprios, usando os IDs estáveis dos objetos do cenário.
// Para nomear outra casa ou monumento, adicione aqui: 'id-do-objeto': 'Nome'.
// A ausência de cadastro significa displayName: null; não altera as fotos.
export const PLACE_NAMES = Object.freeze({
  'w15-fc-motos-yamaha': 'O Péricles',
  'cm-igreja-praca': 'Igreja da Matriz',
  'praca-do-cinema': 'Praça do Cinema',
  'cruzeiro-do-sul': 'Cruzeiro do Sul',
});

/**
 * Metadados comuns de construções, praças e monumentos.
 * `name`, quando existente, continua sendo a descrição do levantamento.
 * `displayName` reserva o nome próprio; `placeType` identifica o tipo de local.
 * Esses campos não criam etiquetas na tela nem alteram placas das fachadas.
 */
export function withPlaceName(entity) {
  return {
    ...entity,
    placeType: entity.placeType ?? 'building',
    displayName: Object.hasOwn(PLACE_NAMES, entity.id) ? PLACE_NAMES[entity.id] : null,
  };
}
