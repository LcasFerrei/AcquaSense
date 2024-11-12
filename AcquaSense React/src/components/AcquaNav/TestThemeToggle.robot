*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}    http://localhost:3000/Dashboard

*** Test Cases ***
Switch Between Dark Mode and Light Mode
    [Documentation]    Teste de alternância entre modo escuro e modo claro na página inicial
    Open Browser       ${URL}    chrome

    # Alternar para o modo escuro
    Click Button       xpath=//button[contains(@class, 'theme-toggle')]
    Wait Until Element Contains    xpath=//body    dark-mode
    Log                 Modo escuro ativado com sucesso

    # Alternar de volta para o modo claro
    Click Button       xpath=//button[contains(@class, 'theme-toggle')]
    Wait Until Element Does Not Contain    xpath=//body    dark-mode
    Log                 Modo claro ativado com sucesso

    Close Browser
