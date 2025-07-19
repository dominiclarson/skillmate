

import fs from 'fs';
import path from 'path';

beforeEach(() => {
  const file = path.join(process.cwd(), 'data', 'users.json');
  if (fs.existsSync(file)) fs.unlinkSync(file);
});
