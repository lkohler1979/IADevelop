# 1. Instalar e compilar
cd mcp-postgres-server
npm install
npm run build

# 2. Criar .env com suas credenciais
cp .env.example .env
# edite o .env

# 3. Registrar no Cowork Desktop
# Configurações → MCP Servers → Add Server
# Cole o JSON com o caminho absoluto do dist/index.js