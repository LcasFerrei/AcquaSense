*** Settings ***
Library    SeleniumLibrary

*** Variables ***
&{login}
...    url_login=http://localhost:3000/login
...    url_dashboard=http://localhost:3000/Dashboard
...    username=Jardiana
...    password=12345678
...    btn_submit=//button[@type='submit']

&{logout}
...    btn_logout=//a[normalize-space()='Logout']

*** Keywords ***
Acessar sistema
    [Arguments]    ${url}
    Open Browser    ${url}    chrome
    Maximize Browser Window
    Sleep    1s
    Capture Page Screenshot

Preencher Formulário de Login
    [Arguments]    ${username}    ${password}
    Input Text    name=username    ${username}
    Input Text    name=password    ${password}
    Capture Page Screenshot
    Sleep    1s

Submeter Formulário de Login
    Click Button    ${login.btn_submit}

Ir Para Dashboard
    Go To    ${login.url_dashboard}
    Sleep    1s
    Capture Page Screenshot

Realizar Logout
    Log To Console    Tentando clicar no botão de logout
    Wait Until Element Is Visible    ${logout.btn_logout}    timeout=5s
    Log To Console    Botão de logout visível
    Wait Until Element Is Enabled    ${logout.btn_logout}    timeout=5s
    Log To Console    Botão de logout habilitado
    Click Element    ${logout.btn_logout}
    Log To Console    Clique realizado no botão de logout
    Sleep    1s
    Capture Page Screenshot
    Location Should Be    ${login.url_login}
    Log To Console    Logout bem-sucedido e redirecionado

*** Test Cases ***
Teste de Logout Funcional
    Given que estou na tela de login    ${login.url_login}
    Sleep    1s
    When preencho o formulário de login    ${login.username}    ${login.password}
    Sleep    1s
    And submeto o formulário de login
    Sleep    1s
    Then vou para o dashboard
    Sleep    1s
    And realizo logout
    Close Browser

*** Keywords ***
que estou na tela de login
    [Arguments]    ${url}
    Acessar sistema    ${url}

preencho o formulário de login
    [Arguments]    ${username}    ${password}
    Preencher Formulário de Login    ${username}    ${password}

submeto o formulário de login
    Submeter Formulário de Login

vou para o dashboard
    Ir Para Dashboard

realizo logout
    Realizar Logout