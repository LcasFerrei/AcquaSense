*** Settings ***
Library    SeleniumLibrary

*** Variables ***
&{login}
...    url_login=http://localhost:3000/login
...    url_dashboard=http://localhost:3000/Dashboard
...    username=Lucas
...    password=MarveLcas1634?
...    btn_submit=//button[@type='submit']  

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

*** Test Cases ***
Teste de Pesquisa Funcional
    Given que estou na tela de login    ${login.url_login}
    Sleep    1s  
    When preencho o formulário de login    ${login.username}    ${login.password}
    Sleep    1s  
    And submeto o formulário de login
    Sleep    1s  
    Then vou para o dashboard
    Sleep    1s  
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
