import pino from 'pino';
import { environment } from '../config/environment.js';

export const logger = pino({ level: environment.logLevel });
