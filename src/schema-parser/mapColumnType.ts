import { ColumnType } from './types';

export default function mapColumnType(type: string): ColumnType {
  type = type.toLowerCase();

  switch (type) {
    case 'text':
    case 'public.citext':
    case 'character':
    case 'uuid':
    case 'inet':
      return 'string';
    case 'integer':
    case 'bigint':
      return 'integer';
    case 'decimal':
      return 'float';
    case 'boolean':
      return 'boolean';
    case 'date':
    case 'timestamp':
      return 'date';
  }

  if (/varchar\(\d+\)/.test(type)) {
    return 'string';
  }

  if (/char\(\d+\)/.test(type)) {
    return 'string';
  }

  if (/character\(\d+\)/.test(type)) {
    return 'string';
  }

  throw new Error(`Unrecognized column type "${type}"`);
}
