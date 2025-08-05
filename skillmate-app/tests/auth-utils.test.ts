
import '@testing-library/jest-dom';
import { createUser, findUserByEmail, verifyPassword } from '@/lib/auth-utils';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

jest.mock('@/lib/db');
jest.mock('bcryptjs');

const mockPool = pool as jest.Mocked<typeof pool>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('auth-utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBcrypt.hash.mockResolvedValue('hashedpassword');
    mockBcrypt.compare.mockResolvedValue(true);
  });

  it('can create and find a user', async () => {
    mockPool.execute
      .mockResolvedValueOnce([{ insertId: 1 }] as any)
      .mockResolvedValueOnce([[{ id: 1, email: 'brian@goat.com', password: 'hashedpassword' }]] as any);
    
    const user = await createUser('brian@goat.com', 'secret123');
    expect(user.email).toBe('brian@goat.com');
    expect(user.id).toBe(1);
    
    const found = await findUserByEmail('brian@goat.com');
    expect(found).toBeDefined();
    expect(found!.email).toBe('brian@goat.com');
    expect(found!.id).toBe(1);
  });

  it('hashes passwords', async () => {
    const plain = 'mypw';
    mockBcrypt.hash.mockResolvedValue('hashedmypw');
    mockPool.execute.mockResolvedValue([{ insertId: 1 }] as any);
    
    await createUser('x@y.com', plain);
    expect(mockBcrypt.hash).toHaveBeenCalledWith(plain, 10);
    
    const match = await verifyPassword(plain, 'hashedmypw');
    expect(match).toBe(true);
    
    mockBcrypt.compare.mockResolvedValue(false);
    const mismatch = await verifyPassword('wrong', 'hashedmypw');
    expect(mismatch).toBe(false);
  });

  it('handles user creation when email already exists', async () => {
    mockPool.execute.mockRejectedValue(new Error('Duplicate entry'));
    
    await expect(createUser('dup@dup.com', 'pw')).rejects.toThrow('Duplicate entry');
  });
});
