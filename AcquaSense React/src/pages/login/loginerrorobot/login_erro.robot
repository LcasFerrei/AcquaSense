*** Settings ***
Library    SeleniumLibrary
Library    String

*** Variables ***
&{login}
...    url_login=http://localhost:3000/login
...    btn_submit=//button[@type='submit']  

*** Keywords ***
Acessar sistema
    [Arguments]    ${url}
    Open Browser    ${url}    chrome
    Maximize Browser Window
    Sleep    1s
    Capture Page Screenshot

Preencher Campo Usuário
    [Arguments]    ${username}
    Input Text    name=username    ${username}
    Sleep    1s

Preencher Campo Senha
    [Arguments]    ${password}
    Input Text    name=password    ${password}
    Sleep    1s

Submeter Formulário de Login
    Click Button    ${login.btn_submit} 
    Sleep    1s

Verificar Alerta
    ${alert_text}=    Handle Alert    action=ACCEPT
    Sleep    1s
    Log    Alerta exibido: ${alert_text}
    Should Be Equal As Strings    ${alert_text}    Credenciais inválidas.
    Capture Page Screenshot

*** Test Cases ***
Teste de Login com Email Inválido
    Dado que estou na tela de login    ${login.url_login}
    Quando preencher o campo usuário com email inválido    testeemail.com
    E preencher o campo senha    qualquer_senha
    E tiro uma captura de tela do formulário preenchido
    E submeto o formulário de login
    Então o sistema exibe mensagem de erro
    Close Browser

*** Keywords ***

Dado que estou na tela de login
    [Arguments]    ${url}
    Acessar sistema    ${url}

Quando preencher o campo usuário com email inválido
    [Arguments]    ${username}
    Preencher Campo Usuário    ${username}

E preencher o campo senha
    [Arguments]    ${password}
    Preencher Campo Senha    ${password}

E tiro uma captura de tela do formulário preenchido
    Capture Page Screenshot

E submeto o formulário de login
    Submeter Formulário de Login

Então o sistema exibe mensagem de erro
    Verificar Alerta
