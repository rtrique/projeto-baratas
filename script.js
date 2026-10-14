function responder(alternativa) {
    const resposta = document.getElementById("resposta");

    if (alternativa === "C") {
        resposta.textContent = "✅ Correto! Os cercos caudais detectam correntes de ar e ajudam a barata a reagir rapidamente.";
        resposta.style.color = "#15803d";
    } else {
        resposta.textContent = "❌ Ainda não! Dica: são estruturas sensoriais localizadas na parte traseira do corpo.";
        resposta.style.color = "#b91c1c";
    }
}

// Anima os blocos conforme entram na área visível, sem esconder o conteúdo
// em navegadores que não oferecem suporte ao IntersectionObserver.
document.addEventListener("DOMContentLoaded", () => {
    const elementos = document.querySelectorAll("main section");

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    elementos.forEach((elemento) => elemento.classList.add("reveal"));

    const observador = new IntersectionObserver((entradas, observer) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.12 });

    elementos.forEach((elemento) => observador.observe(elemento));
});
