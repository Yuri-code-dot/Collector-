import fs from 'fs/promises';
import path from 'path';
import logger from '../logger';
import { CollectorOptions } from '../types';

export class FileCollector {
  async collect(options: CollectorOptions): Promise<unknown[]> {
    const { url } = options;

    if (!url) {
      throw new Error('File path is required for file collector');
    }

    try {
      logger.info({ filePath: url }, 'Reading file');

      const fileContent = await fs.readFile(url, 'utf-8');
      const ext = path.extname(url).toLowerCase();

      let data: unknown[];

      if (ext === '.json') {
        const parsed = JSON.parse(fileContent);
        data = Array.isArray(parsed) ? parsed : [parsed];
      } else if (ext === '.csv') {
        // Simple CSV parsing (for production, use a library like csv-parse)
        const lines = fileContent.split('\n').filter((l) => l.trim());
        const headers = lines[0].split(',').map((h) => h.trim());
        data = lines.slice(1).map((line) => {
          const values = line.split(',').map((v) => v.trim());
          return headers.reduce((obj: Record<string, string>, header, idx) => {
            obj[header] = values[idx] || '';
            return obj;
          }, {});
        });
      } else {
        throw new Error(`Unsupported file format: ${ext}`);
      }

      logger.info({ filePath: url, recordCount: data.length }, 'File collection successful');
      return data;
    } catch (error) {
      const err = error as Error;
      logger.error({ filePath: url, error: err.message }, 'File collection failed');
      throw err;
    }
  }
}

export default new FileCollector();
