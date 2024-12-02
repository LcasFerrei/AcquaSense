*** Settings ***
Library    SeleniumLibrary

*** Variables ***
&{cadastro}
...    url_cadastro=http://localhost:3000/login  
...    url_dashboard=http://localhost:3000/Dashboard
...    btn_cadastro=//*[@id="root"]/div/div[1]/button  
...    username=RobotTeste5
...    email=robotteste@unifor.br  
...    password=987654321  
...    btn_submit=//*[@id="buttonEntrar"] 


*** Keywords ***
Acessar sistema
    [Arguments]    ${url}
    Open Browser    ${url}    chrome
    Maximize Browser Window
    Sleep    1s
    Capture Page Screenshot

Clique no Botão de Cadastro
    Wait Until Element Is Visible    ${cadastro.btn_cadastro}    timeout=10s
    Click Element    ${cadastro.btn_cadastro}  
    Sleep    1s
    Capture Page Screenshot

Preencher Formulário de Cadastro
    [Arguments]    ${username}    ${email}    ${password}
    Wait Until Element Is Visible    name=username    timeout=10s
    Input Text    name=username    ${username}  
    Sleep    1s
    Wait Until Element Is Visible    name=email    timeout=10s
    Input Text    name=email    ${email}  
    Sleep    1s
    Wait Until Element Is Visible    name=password    timeout=10s
    Input Text    name=password    ${password}  
    Sleep    1s
    Capture Page Screenshot

Submeter Formulário de Cadastro
    Wait Until Element Is Visible    ${cadastro.btn_submit}    timeout=10s
    Click Element    ${cadastro.btn_submit}  
    Sleep    2s
    Capture Page Screenshot


Ir Para Dashboard
    Go To    ${login.url_dashboard}
    Sleep    1s  
    Capture Page Screenshot


*** Test Cases ***
Cadastro de usuário com sucesso
    Given que estou na tela de login   ${cadastro.url_cadastro}
    Sleep    1s
    When clico no botão de cadastro
    Sleep    1s
    And preencho o formulário de cadastro    ${cadastro.username}    ${cadastro.email}    ${cadastro.password}
    Sleep    1s
    And submeto o formulário de cadastro
    Sleep    2s
    And acesso o dashboard
    Sleep    3s
    Close Browser

*** Keywords ***
que estou na tela de login
    [Arguments]    ${url}
    Acessar sistema    ${url}

clico no botão de cadastro
    Clique no Botão de Cadastro

preencho o formulário de cadastro
    [Arguments]    ${username}    ${email}    ${password}
    Preencher Formulário de Cadastro    ${username}    ${email}    ${password}

submeto o formulário de cadastro
    Submeter Formulário de Cadastro

acesso o dashboard
    Ir para Dashboard
