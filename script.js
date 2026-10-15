function responder(alternativa) {
    const resposta = document.getElementById("resposta");
    if (!resposta) return;
    if (alternativa === "C") {
        resposta.textContent = "✅ Correto! Os cercos caudais detectam correntes de ar e ajudam a barata a reagir rapidamente.";
        resposta.style.color = "#77d99b";
    } else {
        resposta.textContent = "❌ Ainda não! Dica: são estruturas sensoriais localizadas na parte traseira do corpo.";
        resposta.style.color = "#f28c83";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const themeButton = document.getElementById("themeToggle");
    const menuButton = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const progress = document.getElementById("scrollProgress");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Tema claro/escuro com preferência salva.
    let savedTheme = null;
    try { savedTheme = localStorage.getItem("baratas-theme"); } catch (_) {}
    if (savedTheme === "light") root.dataset.theme = "light";
    const updateThemeButton = () => {
        const light = root.dataset.theme === "light";
        if (themeButton) {
            themeButton.innerHTML = (light ? "☀️" : "🌙") + " <span>" + (light ? "Claro" : "Escuro") + "</span>";
            themeButton.setAttribute("aria-label", light ? "Ativar tema escuro" : "Ativar tema claro");
        }
    };
    updateThemeButton();
    themeButton?.addEventListener("click", () => {
        const light = root.dataset.theme !== "light";
        if (light) root.dataset.theme = "light";
        else delete root.dataset.theme;
        try { localStorage.setItem("baratas-theme", light ? "light" : "dark"); } catch (_) {}
        updateThemeButton();
    });

    // Menu responsivo.
    menuButton?.addEventListener("click", () => {
        const open = navLinks.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.textContent = open ? "✕" : "☰";
    });
    navLinks?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton?.setAttribute("aria-expanded", "false");
        if (menuButton) menuButton.textContent = "☰";
    }));

    // Indicador de progresso da página e botão voltar ao topo.
    const topButton = document.createElement("button");
    topButton.className = "back-to-top";
    topButton.type = "button";
    topButton.setAttribute("aria-label", "Voltar ao topo");
    topButton.title = "Voltar ao topo";
    topButton.textContent = "↑";
    document.body.appendChild(topButton);
    topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));

    const updateScroll = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const amount = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
        if (progress) progress.style.width = amount + "%";
        topButton.classList.toggle("visible", window.scrollY > 500);
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    // Animações de entrada acionadas ao rolar para baixo.
    const animated = document.querySelectorAll("main section, main .card, main .photo-card, main .destaque, main .lei, main .curiosidade");
    if (!reducedMotion && "IntersectionObserver" in window) {
        animated.forEach(el => {
            if (!el.classList.contains("reveal")) el.classList.add("reveal");
        });
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
        animated.forEach(el => observer.observe(el));
    } else {
        animated.forEach(el => el.classList.add("visible"));
    }

    // Marca no menu a seção que está sendo lida.
    const sections = document.querySelectorAll("main section[id], .hero[id]");
    if ("IntersectionObserver" in window) {
        const activeObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = entry.target.id;
                navLinks?.querySelectorAll("a[href^='#']").forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === "#" + id);
                });
            });
        }, { rootMargin: "-25% 0px -65% 0px" });
        sections.forEach(section => activeObserver.observe(section));
    }

    // Evita deixar espaços vazios caso uma imagem externa esteja indisponível.
    document.querySelectorAll(".photo-card img").forEach(img => {
        img.addEventListener("error", () => {
            img.style.display = "none";
            img.parentElement.classList.add("image-fallback");
        }, { once: true });
    });
});


// Interações educativas adicionais.
document.addEventListener("DOMContentLoaded", () => {
    const inventionCopy = {
        resgate: "🚨 Um robô pequeno e flexível poderia explorar frestas em escombros e enviar imagens para equipes de resgate. É uma inspiração de pesquisa, não uma solução universal pronta.",
        ambiente: "🌿 Um robô inspirado na locomoção da barata poderia circular por terrenos irregulares para observar áreas naturais e coletar dados ambientais.",
        saude: "🩺 Sensores e robôs miniaturizados podem, no futuro, ajudar profissionais a inspecionar locais de difícil acesso. A segurança e a validação médica são indispensáveis."
    };
    document.querySelectorAll("[data-invention]").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll("[data-invention]").forEach(item => item.classList.remove("selected"));
            button.classList.add("selected");
            const result = document.getElementById("inventionResult");
            if (result) result.textContent = inventionCopy[button.dataset.invention] || "";
        });
    });

    const missionChecks = [...document.querySelectorAll(".mission-check")];
    const progressBar = document.getElementById("missionProgressBar");
    const progressText = document.getElementById("missionProgressText");
    const updateMission = () => {
        const done = missionChecks.filter(check => check.checked).length;
        if (progressBar) progressBar.style.width = (done / Math.max(missionChecks.length, 1) * 100) + "%";
        if (progressText) progressText.textContent = done === missionChecks.length
            ? "🎉 Missão concluída! Você deu passos para aprender e compartilhar informação responsável."
            : done + " de " + missionChecks.length + " ações concluídas. Toda atitude consciente conta!";
        try { localStorage.setItem("baratas-missao", JSON.stringify(missionChecks.filter(c => c.checked).map(c => c.value))); } catch (_) {}
    };
    try {
        const saved = JSON.parse(localStorage.getItem("baratas-missao") || "[]");
        missionChecks.forEach(check => check.checked = saved.includes(check.value));
    } catch (_) {}
    missionChecks.forEach(check => check.addEventListener("change", updateMission));
    updateMission();

    const shareButton = document.getElementById("shareMission");
    const shareFeedback = document.getElementById("shareFeedback");
    shareButton?.addEventListener("click", async () => {
        const message = "Você sabia? As baratas têm um papel na reciclagem de matéria orgânica e também inspiram pesquisas em robótica. Conhecer a natureza ajuda a tomar decisões melhores! — Mundo das Baratas";
        try {
            if (navigator.share) {
                await navigator.share({ title: "Mundo das Baratas", text: message });
                if (shareFeedback) shareFeedback.textContent = "Mensagem compartilhada!";
            } else if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(message);
                if (shareFeedback) shareFeedback.textContent = "Mensagem copiada! Agora é só enviar para alguém.";
            } else {
                const field = document.createElement("textarea");
                field.value = message;
                field.setAttribute("readonly", "");
                field.style.position = "fixed";
                field.style.opacity = "0";
                document.body.appendChild(field);
                field.select();
                const copied = document.execCommand("copy");
                field.remove();
                if (shareFeedback) shareFeedback.textContent = copied ? "Mensagem copiada! Agora é só enviar para alguém." : message;
            }
        } catch (error) {
            if (error && error.name === "AbortError") return;
            if (shareFeedback) shareFeedback.textContent = message;
        }
    });
});


// Checklist de prevenção doméstica: progresso salvo apenas no navegador.
document.addEventListener("DOMContentLoaded", () => {
    const checks = [...document.querySelectorAll(".prevention-check")];
    const bar = document.getElementById("preventionProgressBar");
    const textNode = document.getElementById("preventionProgressText");
    const feedback = document.getElementById("preventionFeedback");
    const update = () => {
        const done = checks.filter(item => item.checked).length;
        if (bar) bar.style.width = (done / Math.max(checks.length, 1) * 100) + "%";
        if (textNode) textNode.textContent = done === checks.length
            ? "🎉 Plano completo! Continue mantendo esses hábitos."
            : done + " de " + checks.length + " medidas concluídas.";
        try { localStorage.setItem("baratas-prevencao", JSON.stringify(checks.filter(item => item.checked).map(item => item.value))); } catch (_) {}
    };
    try {
        const saved = JSON.parse(localStorage.getItem("baratas-prevencao") || "[]");
        checks.forEach(item => item.checked = saved.includes(item.value));
    } catch (_) {}
    checks.forEach(item => item.addEventListener("change", update));
    update();

    const copyButton = document.getElementById("copyPreventionPlan");
    const copyPlanFallback = (value) => {
        const field = document.createElement("textarea");
        field.value = value;
        field.setAttribute("readonly", "");
        field.setAttribute("aria-hidden", "true");
        field.style.position = "fixed";
        field.style.left = "0";
        field.style.top = "0";
        field.style.width = "2px";
        field.style.height = "2px";
        field.style.padding = "0";
        field.style.border = "0";
        field.style.opacity = "0.01";
        field.style.fontSize = "16px";
        document.body.appendChild(field);
        field.focus();
        field.select();
        field.setSelectionRange(0, field.value.length);
        let copied = false;
        try { copied = document.execCommand("copy"); } catch (_) {}
        field.remove();
        return copied;
    };

    copyButton?.addEventListener("click", async () => {
        const getLabel = item => {
            const label = item.closest("label");
            return label ? label.textContent.trim().replace(/\\s+/g, " ") : item.value;
        };
        const done = checks.filter(item => item.checked).map(getLabel);
        const pending = checks.filter(item => !item.checked).map(getLabel);
        const plan = "MEU PLANO DE PREVENÇÃO CONTRA BARATAS\\n\\nConcluído:\\n" +
            (done.length ? done.map(x => "✓ " + x).join("\\n") : "Ainda não marquei nenhuma medida.") +
            "\\n\\nPróximos passos:\\n" + (pending.length ? pending.map(x => "□ " + x).join("\\n") : "Tudo marcado!") +
            "\\n\\nDica de segurança: nunca misture produtos de limpeza ou inseticidas e siga as instruções do rótulo.";
        const showFeedback = message => {
            if (feedback) {
                feedback.textContent = message;
                feedback.classList.remove("feedback-pop");
                void feedback.offsetWidth;
                feedback.classList.add("feedback-pop");
            }
        };
        let copied = false;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(plan);
                copied = true;
            }
        } catch (_) {}
        if (!copied) copied = copyPlanFallback(plan);

        if (copied) {
            showFeedback("✅ Plano copiado! Agora você pode colar nas suas notas ou enviar para alguém.");
            if (copyButton) {
                const originalText = copyButton.dataset.originalText || copyButton.textContent;
                copyButton.dataset.originalText = originalText;
                copyButton.textContent = "✓ Copiado!";
                copyButton.classList.add("copy-success");
                window.setTimeout(() => {
                    copyButton.textContent = originalText;
                    copyButton.classList.remove("copy-success");
                }, 2200);
            }
        } else {
            showFeedback("Seu navegador bloqueou a cópia automática. O plano está abaixo — selecione e copie manualmente:\\n\\n" + plan);
        }
    });
});
