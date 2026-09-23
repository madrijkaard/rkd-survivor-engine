// node --use-system-ca reference/scripts/capture/capture-mendonca.mjs <pano> <latitude> <longitude> [bairro]
import { captureKnownStreet } from './capture-street.mjs';
await captureKnownStreet('conego-mendonca', 'Rua Cônego Mendonça');
