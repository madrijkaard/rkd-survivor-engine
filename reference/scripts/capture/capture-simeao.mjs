// node --use-system-ca reference/scripts/capture/capture-simeao.mjs <pano> <latitude> <longitude> [bairro]
import { captureKnownStreet } from './capture-street.mjs';
await captureKnownStreet('simeao-de-macedo', 'Rua Simeão de Macedo');
