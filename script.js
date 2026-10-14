function responder(alternativa) {

    const resposta = document.getElementById("resposta");

    if (alternativa === "C") {

        resposta.textContent =
            "✅ Correto! A resposta é C: Independência dos raios de luz.";

    } else {

        resposta.textContent =
            "❌ Não é essa. Tente novamente! Dica: um raio de luz não interfere na trajetória do outro.";

    }

}

