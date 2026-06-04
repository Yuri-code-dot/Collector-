import { v4 as uuidv4 } from 'uuid';
import axios, { AxiosError } from 'axios';
import logger from '../logger';
import { CollectorOptions } from '../types';

export class HTTPCollector {
  async collect(options: CollectorOptions): Promise<unknown[]> {
    const {
      url,
      method = 'GET',
      headers = {},
      timeout = 30000,
      retries = 3,
    } = options;

    if (!url) {
      throw new Error('URL is required for HTTP collector');
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logger.info({ url, attempt, method }, 'Fetching data from HTTP source');

        const response = await axios({
          method,
          url,
          headers,
          timeout,
        });

        logger.info({ url, recordCount: response.data.length }, 'HTTP collection successful');

        // Handle pagination if response contains array
        if (Array.isArray(response.data)) {
          return response.data;
        }

        // Handle single object or nested data
        return [response.data];
      } catch (error) {
        lastError =
          error instanceof AxiosError
            ? new Error(`HTTP Error: ${error.message}`)
            : (error as Error);

        logger.warn(
          { url, attempt, error: lastError.message },
          `HTTP collection attempt ${attempt} failed`
        );

        if (attempt < retries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('HTTP collection failed after retries');
  }
}

export default new HTTPCollector();
