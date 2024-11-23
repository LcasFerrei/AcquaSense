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
    FOR  ${i}  IN RANGE      1     5
        Input Text    ${textarea_message}    ${i}
        Click Element    ${button_send}
        Sleep    2s
        Capture Page Screenshot  hiveMQ_message_${i}.png
    END

Abrir Acquasense
    Open Browser  http://localhost:3000/  chrome
    Maximize Browser Window
    Sleep  2s
    Capture Page Screenshot  acquasense_homepage.png

Logar
    Click Element    ${button_portalCliente} 
    Sleep  3s
    Input Text       ${input_username}    Saul
    Sleep  2s
    Input Text       ${input_password}    acquasense
    Sleep  2s
    Click Element    ${button_entrar}  
    Sleep  2s
    Capture Page Screenshot  acquasense_logged_in.png

Acessar a página de consumo diário
    Click Element    ${button_diario}
    Sleep  5s
    Capture Page Screenshot  acquasense_daily_consumption.png

** Test Cases **
Cenário 1: Inicializando o Hive MQ
    Abrir hiveMQ
    Conectando o hiveMQ
    Adicionando novo topico
    Enviando mensagens

Cenário 2: Visualizando dados no acquasense
    Abrir Acquasense
    Logar
    Acessar a página de consumo diário
