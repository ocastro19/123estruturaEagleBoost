#!/usr/bin/env node

/**
 * Script para gerar build de produção e preparar arquivos para hospedagem
 * Uso: npm run build:hosting
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

console.log('🚀 Iniciando build para hospedagem...');

try {
  // Limpar pasta dist anterior
  console.log('🧹 Limpando pasta dist anterior...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Executar build de produção
  console.log('📦 Gerando build de produção...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verificar se o build foi criado
  if (!fs.existsSync('dist')) {
    throw new Error('Pasta dist não foi criada');
  }

  // Criar arquivo de informações do build
  const buildInfo = {
    timestamp: new Date().toISOString(),
    version: require('./package.json').version,
    buildDate: new Date().toLocaleString('pt-BR'),
    files: fs.readdirSync('dist')
  };

  fs.writeFileSync(
    path.join('dist', 'build-info.json'),
    JSON.stringify(buildInfo, null, 2)
  );

  console.log('✅ Build concluído com sucesso!');
  console.log('📁 Arquivos gerados na pasta dist/');
  console.log('📋 Informações do build:');
  console.log(`   - Data: ${buildInfo.buildDate}`);
  console.log(`   - Versão: ${buildInfo.version}`);
  console.log(`   - Arquivos: ${buildInfo.files.length}`);
  console.log('');
  console.log('🌐 Para fazer deploy:');
  console.log('   1. Copie todos os arquivos da pasta dist/');
  console.log('   2. Faça upload para sua hospedagem');
  console.log('   3. Configure o servidor para servir index.html como fallback');

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}