*** Settings ***
Library    SeleniumLibrary

*** Variables ***
&{tema}
...    url_acqua=http://localhost:3000/
...    btn_escuro=//button[contains(.,'Modo Escuro')]
...    btn_claro=//button[contains(.,'Modo Claro')]

*** Keywords ***
Acessar sistema
    [Arguments]    ${url}
    Open Browser    ${url}    chrome
    Maximize Browser Window
    Capture Page Screenshot

Realizar clique
    [Arguments]    ${locator}
    Click Element    ${locator}

*** Test Cases ***
Teste Alternar Tema
    Given que estou na tela principal    ${tema.url_acqua}
    When clico para ativar o modo escuro    ${tema.btn_escuro}
    Sleep    5s
    Capture Page Screenshot    # Captura após ativar o modo escuro
    When clico para ativar o modo claro    ${tema.btn_claro}
    Sleep    5s
    Capture Page Screenshot    # Captura após ativar o modo claro

*** Keywords ***
Given que estou na tela principal
    [Arguments]    ${url}
    Acessar sistema    ${url}

When clico para ativar o modo escuro
    [Arguments]    ${locator}
    Realizar clique    ${locator}

When clico para ativar o modo claro
    [Arguments]    ${locator}
    Realizar clique    ${locator}
