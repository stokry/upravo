export const SUPABASE_URL = 'https://kibfdaxeegvddusnknfs.supabase.co/rest/v1/articles';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYmZkYXhlZWd2ZGR1c25rbmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzMTQ2NzMsImV4cCI6MjAzOTg5MDY3M30.l9HjERTXw_8mAqzIOkv8vck82CBbh2wPiZ_pS96k7Mg';

export const CATEGORIES = {
  VIJESTI: 'Vijesti',
  SVIJET: 'Svijet',
  REGIJA: 'Regija',
  CRNA_KRONIKA: 'Crna kronika',
  SPORT: 'sport',
  LIFESTYLE: 'Lifestyle',
  MAGAZIN: 'Magazin',
  ZDRAVLJE: 'Zdravlje'
} as const;

export const CATEGORY_NAMES = {
  [CATEGORIES.VIJESTI]: 'Vijesti',
  [CATEGORIES.SVIJET]: 'Svijet',
  [CATEGORIES.REGIJA]: 'Regija',
  [CATEGORIES.CRNA_KRONIKA]: 'Crna kronika',
  [CATEGORIES.SPORT]: 'Sport',
  [CATEGORIES.LIFESTYLE]: 'Lifestyle',
  [CATEGORIES.MAGAZIN]: 'Magazin',
  [CATEGORIES.ZDRAVLJE]: 'Zdravlje'
} as const;

export const SPORT_CATEGORIES = {
  NOGOMET: 'Nogomet',
  KOSARKA: 'Košarka',
  TENIS: 'Tenis',
  RUKOMET: 'Rukomet',
  VATERPOLO: 'Vaterpolo',
  FORMULA1: 'Formula 1',
  UFC: 'UFC/MMA',
  OSTALO: 'Ostali sportovi'
} as const;