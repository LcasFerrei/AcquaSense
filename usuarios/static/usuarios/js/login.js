const sign_in_btn = document.querySelector("#sign-in-btn")
const sign_up_btn = document.querySelector("#sign-up-btn")
const container = document.querySelector(".container")

sign_up_btn.addEventListener("click",() => {
    container.classList.add("sign-up-mode");
})

sign_in_btn.addEventListener("click",() => {
    container.classList.remove("sign-up-mode");
})

document.addEventListener("DOMContentLoaded", function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        // Adiciona a classe fade-out após um tempo
        setTimeout(function() {
            alert.classList.add('fade-out');
        }, 2000); // Espera 2 segundos antes de começar o fade-out

        // Remove o elemento do DOM após a animação
        setTimeout(function() {
            alert.remove();
        }, 4000); // 2 segundos para o fade-out + 2 segundos de espera
    });
});
