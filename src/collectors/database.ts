import { Pool, QueryResult } from 'pg';
import logger from '../logger';
import { CollectorOptions } from '../types';

export class DatabaseCollector {
  private pool: Pool | null = null;

  constructor(connectionString?: string) {
    if (connectionString) {
      this.pool = new Pool({ connectionString });
    }
  }

  async collect(options: CollectorOptions & { query: string }): Promise<unknown[]> {
    const { query } = options;

    if (!query) {
      throw new Error('SQL query is required for database collector');
    }

    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    try {
      logger.info({ query }, 'Executing database query');

      const result: QueryResult = await this.pool.query(query);
      const data = result.rows;

      logger.info({ query, recordCount: data.length }, 'Database collection successful');
      return data;
    } catch (error) {
      const err = error as Error;
      logger.error({ query, error: err.message }, 'Database collection failed');
      throw err;
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      logger.info('Database pool closed');
    }
  }
}

export default DatabaseCollector;
