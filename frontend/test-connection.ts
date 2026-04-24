import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Manually parse .env.local
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas em .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log(`\n🔗 Tentando conectar a: ${supabaseUrl}`);
  
  try {
    const { data, error, status } = await supabase
      .from('barbers')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('✅ Conexão estabelecida com sucesso! (Tabela barbers existe)');
      } else if (error.message.includes('relation "public.barbers" does not exist')) {
        console.log('⚠️ Conexão OK, mas a tabela "barbers" não foi encontrada no banco.');
      } else {
        console.error('❌ Erro de conexão/autorização:', error.message);
      }
    } else {
      console.log('✅ Conexão estabelecida com sucesso!');
      console.log(`📡 Status: ${status}`);
    }
  } catch (err: any) {
    console.error('💥 Erro fatal ao tentar conectar:', err.message);
  }
}

testConnection();
