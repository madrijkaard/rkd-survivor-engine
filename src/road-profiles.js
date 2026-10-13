import { manifestRoadProfile } from './road-dimensions.js';

// O JSON é a fonte do tipo de via. A geometria nasce com os perfis corretos,
// antes de montar catálogos, obstáculos ou canvases. Node lê os mesmos arquivos
// locais nos testes; o navegador usa o servidor HTTP, sem etapa de geração.
const folders=['simeao-de-macedo','conego-mendonca','antonio-alexandre','vinte-e-oito-de-julho','fernando-carvalho','praca-alcebiades-silva','coelho-neto','sao-benedito'];
async function readJSON(url) {
  if (typeof process !== 'undefined' && process.versions?.node) {
    const {readFile}=await import('node:fs/promises');
    return JSON.parse(await readFile(url,'utf8'));
  }
  const response=await fetch(url);
  if (!response.ok) throw new Error(`Falha ao carregar tipo de via: ${url}`);
  return response.json();
}
export const roadProfiles=Object.freeze(Object.fromEntries(await Promise.all(folders.map(async folder=>{
  const manifest=await readJSON(new URL(`../maps/${folder}/manifest.json`,import.meta.url));
  return [folder==='simeao-de-macedo'?'simeao':folder,manifestRoadProfile(manifest)];
}))));
export const SIMEAO_ROAD=roadProfiles.simeao;
export const MENDONCA_ROAD=roadProfiles['conego-mendonca'];
export const ANTONIO_ROAD=roadProfiles['antonio-alexandre'];
export const JULHO_PROFILE=roadProfiles['vinte-e-oito-de-julho'];
export const FERNANDO_PROFILE=roadProfiles['fernando-carvalho'];
export const ALCEBIADES_PROFILE=roadProfiles['praca-alcebiades-silva'];
export const COELHO_PROFILE=roadProfiles['coelho-neto'];
export const BENEDITO_PROFILE=roadProfiles['sao-benedito'];
