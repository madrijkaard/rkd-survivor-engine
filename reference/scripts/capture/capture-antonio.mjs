// node --use-system-ca reference/scripts/capture/capture-antonio.mjs <pano> <latitude> <longitude> [bairro]
import { captureKnownStreet } from './capture-street.mjs';
await captureKnownStreet('antonio-alexandre', 'Rua Antônio Alexandre');
