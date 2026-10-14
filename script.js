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
