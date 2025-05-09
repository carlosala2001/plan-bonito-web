
#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Por favor ejecute este script con sudo:${NC}"
  echo "sudo $0"
  exit 1
fi

# Print banner
echo -e "${GREEN}"
echo "===================================================="
echo "  ZenoScale Admin Panel - Script de Instalación"
echo "===================================================="
echo -e "${NC}"

# Check if MySQL is installed
echo -e "${YELLOW}Verificando MySQL...${NC}"
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}MySQL no está instalado. Instalando...${NC}"
    apt-get update
    apt-get install -y mysql-server
    systemctl start mysql
    systemctl enable mysql
    echo -e "${GREEN}MySQL instalado correctamente.${NC}"
else
    echo -e "${GREEN}MySQL ya está instalado.${NC}"
fi

# Check if Node.js is installed
echo -e "${YELLOW}Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js no está instalado. Instalando...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo -e "${GREEN}Node.js instalado correctamente.${NC}"
else
    echo -e "${GREEN}Node.js ya está instalado.${NC}"
fi

# Check if npm is installed
echo -e "${YELLOW}Verificando npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm no está instalado. Instalando...${NC}"
    apt-get install -y npm
    echo -e "${GREEN}npm instalado correctamente.${NC}"
else
    echo -e "${GREEN}npm ya está instalado.${NC}"
fi

# Navigate to project root
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# Ask for MySQL configuration
echo -e "${YELLOW}Configuración de la base de datos MySQL${NC}"
read -p "Nombre de la base de datos (predeterminado: zenoscale_admin): " DB_NAME
DB_NAME=${DB_NAME:-zenoscale_admin}

read -p "Usuario de MySQL (predeterminado: root): " DB_USER
DB_USER=${DB_USER:-root}

read -s -p "Contraseña de MySQL: " DB_PASSWORD
echo ""

read -p "Host de MySQL (predeterminado: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

# Create database
echo -e "${YELLOW}Creando base de datos...${NC}"
mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Base de datos creada correctamente.${NC}"
else
    echo -e "${RED}Error al crear la base de datos.${NC}"
    exit 1
fi

# Ask for JWT secret
echo -e "${YELLOW}Configuración de JWT${NC}"
read -p "JWT Secret (predeterminado: auto-generado): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Secret generado automáticamente."
fi

# Create .env file
echo -e "${YELLOW}Creando archivo .env...${NC}"
cat > "$PROJECT_DIR/server/.env" << EOF
PORT=3001
NODE_ENV=production
DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
JWT_SECRET=$JWT_SECRET
EOF

# Install frontend dependencies
echo -e "${YELLOW}Instalando dependencias del frontend...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Dependencias del frontend instaladas correctamente.${NC}"
else
    echo -e "${RED}Error al instalar las dependencias del frontend.${NC}"
    exit 1
fi

# Build frontend
echo -e "${YELLOW}Compilando el frontend...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Frontend compilado correctamente.${NC}"
else
    echo -e "${RED}Error al compilar el frontend.${NC}"
    exit 1
fi

# Install backend dependencies
echo -e "${YELLOW}Instalando dependencias del backend...${NC}"
cd "$PROJECT_DIR/server"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Dependencias del backend instaladas correctamente.${NC}"
else
    echo -e "${RED}Error al instalar las dependencias del backend.${NC}"
    exit 1
fi

# Create start script
echo -e "${YELLOW}Creando script de inicio...${NC}"
cat > "$PROJECT_DIR/start.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/server"
node server.js
EOF

chmod +x "$PROJECT_DIR/start.sh"

echo -e "${GREEN}"
echo "===================================================="
echo "  ¡Instalación completada!"
echo "===================================================="
echo -e "${NC}"
echo "Para iniciar el panel de administración, ejecute:"
echo -e "${YELLOW}cd \"$PROJECT_DIR\" && ./start.sh${NC}"
echo ""
echo "El panel estará disponible en: http://localhost:3001"
echo ""
echo "Recuerda configurar tu API key de ctrlpanel.gg en el panel de administración"
echo ""
