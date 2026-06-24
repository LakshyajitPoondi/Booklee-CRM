import fs from 'fs';
import path from 'path';
import type { CrmData } from '@/types';
import { getDefaultCrmData } from '@/lib/storage';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'crm-data.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readStore(): CrmData {
  ensureDir();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw) as CrmData;
      if (!data.settings) {
        const defaults = getDefaultCrmData();
        data.settings = defaults.settings;
      }
      return data;
    }
  } catch {
    // Corrupted file — reset to defaults
  }
  const defaults = getDefaultCrmData();
  writeStore(defaults);
  return defaults;
}

export function writeStore(data: CrmData): void {
  ensureDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
