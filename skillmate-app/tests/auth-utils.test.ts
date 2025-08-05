
import { expect, jest, describe, it } from '@jest/globals';
import { toMySqlDateTime } from '@/lib/schedule-utils';


describe('toMySqlDateTime()', () => {
  it('formats Date to `YYYY-MM-DD HH:MM:SS` in UTC', () => {
    const d = new Date(Date.UTC(2025, 0, 2, 3, 4, 5)); // 2025‑01‑02 03:04:05 UTC
    const out = toMySqlDateTime(d);
    expect(out).toBe('2025-01-02 03:04:05');
  });

  it('zero‑pads single digits', () => {
    const d = new Date(Date.UTC(2025, 8, 9, 7, 6, 4)); // 2025‑09‑09 07:06:04
    const out = toMySqlDateTime(d);
    expect(out).toBe('2025-09-09 07:06:04');
  });
});

/**
 * ---------------- notify() ----------------
 */

jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: { execute: jest.fn().mockResolvedValue([{}]) },
}));

import { notify } from '@/lib/schedule-utils';
import pool from '@/lib/db';

const poolExecute = pool.execute as jest.Mock;

describe('notify()', () => {
  it('inserts row with JSON payload', async () => {
    await notify(42, 'session_requested', { sessionId: 99 });

    expect(poolExecute).toHaveBeenCalledTimes(1);
    const [sql, params] = poolExecute.mock.calls[0];
    expect(sql).toMatch(/INSERT INTO Notifications/);
    expect(params[0]).toBe(42); // user_id
    expect(params[1]).toBe('session_requested');
    expect(JSON.parse(params[2])).toEqual({ sessionId: 99 });
  });

  it('throws on invalid type', async () => {
    await expect(
      // @ts-expect-error intentional bad type
      notify(1, 'bogus_type', {})
    ).rejects.toThrow('unknown type');
  });
});
