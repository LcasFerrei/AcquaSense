** Settings **
Library      SeleniumLibrary     

** Variables **
${button_connect}        id:connectButton
${input_topic}           id:publishTopic
${button_add_subs}       id:addSubButton
${input_subscribe}       id:subscribeTopic
${button_subscribe}      id:subscribeButton
${textarea_message}      id:publishPayload
${button_send}           id:publishButton

${button_portalCliente}  id:portalCliente
${input_username}        id:username
${input_password}        id:password
${button_entrar}         id:buttonEntrar
${button_diario}         id:consumptiondailyButton

** Keywords **
Abrir hiveMQ
    Open Browser  https://www.hivemq.com/demos/websocket-client/  chrome
    Maximize Browser Window
    Sleep  2s
    Capture Page Screenshot  hiveMQ_homepage.png

Conectando o hiveMQ
    Click Element    ${button_connect}
    Sleep  2s
    Capture Page Screenshot  hiveMQ_connected.png

Adicionando novo topico
    Input Text       ${input_topic}        teste/acquasense
    Sleep  2s
    Click Element    ${button_add_subs}
    Sleep  2s
    Capture Page Screenshot  hiveMQ_add_topic.png
    Input Text       ${input_subscribe}    teste/acquasense
    Sleep  2s
    Click Element    ${button_subscribe}
    Sleep  2s
    Capture Page Screenshot  hiveMQ_subscribed.png

Enviando mensagens
    FOR  ${i}  IN RANGE      -5     -1
        Input Text    ${textarea_message}    ${i}
        Click Element    ${button_send}
        Sleep    2s
        Capture Page Screenshot  hiveMQ_message_${i}.png
    END

    FOR  ${i}  IN RANGE      0     2
        Input Text    ${textarea_message}    Teste
        Click Element    ${button_send}
        Sleep    2s
    END
        Capture Page Screenshot  hiveMQ_message_TESTE.png

** Test Cases **
Cenário 1: Inicializando o Hive MQ
    Abrir hiveMQ
    Conectando o hiveMQ
    Adicionando novo topico
    Enviando mensagens
