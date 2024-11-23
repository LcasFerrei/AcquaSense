*** Settings ***
Library    SeleniumLibrary
Library    String

*** Variables ***
&{notification}
...    url_notification=http://localhost:3000/Notification
&{login}
...    url_login=http://localhost:3000/login

*** Keywords ***
Acessar Notificação
    [Arguments]    ${url}
    Open Browser    ${url}    chrome
    Maximize Browser Window
    Capture Page Screenshot  
    Sleep    5s


Verificar Redirecionamento
    ${current_url}=    Get Location  
    Log    A página atual é: ${current_url}    
    Should Be Equal As Strings    ${current_url}    ${login.url_login}    
    Capture Page Screenshot    

*** Test Cases ***
Teste de Acesso à Rota Notificação Sem Login
    Dado que tento acessar a rota de notificação sem login    ${notification.url_notification}
    Então sou redirecionado para a tela de login   
    Close Browser

*** Keywords ***

Dado que tento acessar a rota de notificação sem login
    [Arguments]    ${url}
    Acessar Notificação    ${url}

Então sou redirecionado para a tela de login
    Verificar Redirecionamento
