*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}           http://localhost:3000/login
${VALID_USERNAME}    testuser
${VALID_PASSWORD}    testpassword
${INVALID_USERNAME}  invaliduser
${INVALID_PASSWORD}  invalidpassword

*** Test Cases ***
Successful Login
    Open Browser    ${URL}    chrome
    Input Text      name=username    ${VALID_USERNAME}
    Input Text      name=password    ${VALID_PASSWORD}
    Click Button    xpath=//button[contains(text(), 'Entrar')]
    Wait Until Page Contains Element    xpath=//h1[contains(text(), 'Dashboard')]
    Close Browser

Unsuccessful Login With Invalid Credentials
    Open Browser    ${URL}    chrome
    Input Text      name=username    ${INVALID_USERNAME}
    Input Text      name=password    ${INVALID_PASSWORD}
    Click Button    xpath=//button[contains(text(), 'Entrar')]
    Wait Until Page Contains    Ocorreu um erro
    Close Browser
