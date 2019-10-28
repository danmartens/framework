import { Pool, PoolClient } from 'pg';

const pool = new Pool();

export default function getClient(): Promise<PoolClient> {
  return pool.connect();
}
