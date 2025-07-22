

import { createUser, findUserByEmail, verifyPassword } from '@/lib/auth-utils';
import { readUsers, writeUsers } from '@/lib/file-store';

jest.mock('@/lib/file-store');

describe('auth-utils', () => {
  beforeEach(() => {
   
    (readUsers as jest.Mock).mockResolvedValue([]);
    (writeUsers as jest.Mock).mockResolvedValue(undefined);
  });

  it('can create and find a user', async () => {
    
    (readUsers as jest.Mock).mockResolvedValue([]);
    const user = await createUser('brian@goat.com', 'secret123');
    expect(user.email).toBe('brian@goat.com');
    
    (readUsers as jest.Mock).mockResolvedValue([user]);
    const found = await findUserByEmail('brian@goat.com');
    expect(found).toBeDefined();
    expect(found!.email).toBe('brian@goat.com');
  });

  it('hashes passwords', async () => {
    const plain = 'mypw';
    const user = await createUser('x@y.com', plain);
    expect(user.hash).not.toBe(plain);
    const match = await verifyPassword(plain, user.hash);
    expect(match).toBe(true);
    const mismatch = await verifyPassword('wrong', user.hash);
    expect(mismatch).toBe(false);
  });

  it('throws if email exists', async () => {
    const existing = { id: 1, email: 'dup@dup.com', hash: 'h' };
    (readUsers as jest.Mock).mockResolvedValue([existing]);
    await expect(createUser('dup@dup.com', 'pw')).rejects.toThrow('exists');
  });
});
