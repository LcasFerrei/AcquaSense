# AcquaSense

## Visão Geral do Projeto
AcquaSense é um sistema de monitoramento de consumo de água residencial baseado em sensores IoT (Internet das Coisas). O objetivo do sistema é fornecer aos usuários informações detalhadas sobre seu consumo de água, incluindo relatórios diários, mensais e alertas sobre possíveis vazamentos

## Visão Geral do Sistema
Nome do Sistema
O sistema será denominado AcquaSense.

## Objetivo do Sistema
O objetivo principal do AcquaSense é proporcionar aos usuários residenciais um meio eficaz de monitorar e gerenciar seu consumo de água, oferecendo relatórios detalhados e alertas em tempo real sobre vazamentos ou uso excessivo.

## Funcionalidades
Monitorar o consumo de água em tempo real.
Identificar e notificar sobre vazamentos e desperdícios de água.
Gerar relatórios sobre o consumo de água.
Possibilitar a gestão eficiente do uso da água.

## Configuração de Credenciais

Para usar este projeto, você precisará configurar suas credenciais de Wi-Fi. Siga os passos abaixo:

1. Encontre o arquivo `secrets_example.h` no diretório principal do projeto.
2. Copie o arquivo e renomeie-o para `secrets.h`.
3. Abra o arquivo `secrets.h` e preencha com suas credenciais Wi-Fi:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";


## Para Contribuir

### Instalação do Django
 - pip install django 

### Verificar alterações nos Models do Django
 - python manage.py makemigrations 

### Aplica as migrações criadas no Banco de dados
- python manage.py migrate

### Inicia o servidor de desenvolvimento do Django
- python manage.py runserver

