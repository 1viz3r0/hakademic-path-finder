/** Parses SQLite dump INSERT rows from path_finder_schema_and_seed.sql */

function parseValueTuple(source: string, startIndex: number): { values: unknown[]; nextIndex: number } {
  const values: unknown[] = [];
  let i = startIndex;
  if (source[i] === '(') i += 1;

  while (i < source.length) {
    while (source[i] === ' ' || source[i] === '\n' || source[i] === '\r' || source[i] === '\t') i += 1;
    if (source[i] === ')') {
      return { values, nextIndex: i + 1 };
    }
    if (source[i] === ',') {
      i += 1;
      continue;
    }

    if (source.slice(i, i + 4).toUpperCase() === 'NULL' && (i + 4 >= source.length || /[,)\s]/.test(source[i + 4]))) {
      values.push(null);
      i += 4;
      continue;
    }

    if (source[i] === "'") {
      i += 1;
      let str = '';
      while (i < source.length) {
        if (source[i] === "'" && source[i + 1] === "'") {
          str += "'";
          i += 2;
          continue;
        }
        if (source[i] === "'") {
          i += 1;
          break;
        }
        str += source[i];
        i += 1;
      }
      values.push(str);
      continue;
    }

    const num = source.slice(i).match(/^-?\d+(?:\.\d+)?/);
    if (num) {
      values.push(Number(num[0]));
      i += num[0].length;
      continue;
    }

    i += 1;
  }

  return { values, nextIndex: i };
}

export function parseSqlInserts(sql: string): Record<string, unknown[][]> {
  const tables: Record<string, unknown[][]> = {};
  const marker = 'INSERT INTO ';
  let searchFrom = 0;

  while (searchFrom < sql.length) {
    const insertAt = sql.indexOf(marker, searchFrom);
    if (insertAt === -1) break;

    let cursor = insertAt + marker.length;
    while (sql[cursor] === '"' || sql[cursor] === "'") cursor += 1;
    const nameEnd = sql.indexOf('"', cursor) !== -1 && sql[cursor - 1] === '"'
      ? sql.indexOf('"', cursor)
      : cursor;

    let tableName = '';
    if (sql[insertAt + marker.length] === '"') {
      const close = sql.indexOf('"', insertAt + marker.length + 1);
      tableName = sql.slice(insertAt + marker.length + 1, close);
      cursor = close + 1;
    } else {
      const match = sql.slice(insertAt + marker.length).match(/^(\w+)/);
      tableName = match ? match[1] : '';
      cursor = insertAt + marker.length + tableName.length;
    }

    const valuesAt = sql.indexOf('VALUES', cursor);
    if (valuesAt === -1) break;
    let tupleStart = valuesAt + 6;
    while (sql[tupleStart] === ' ' || sql[tupleStart] === '\n') tupleStart += 1;

    const parsed = parseValueTuple(sql, tupleStart);
    if (!tables[tableName]) tables[tableName] = [];
    tables[tableName].push(parsed.values);
    searchFrom = parsed.nextIndex;
  }

  return tables;
}
