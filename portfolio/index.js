        // Elegant scroll reveal with stagger
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.case-card, .note-card, .stack-card, .tl-item, .hero__line, .hero__tags .tag').forEach((el, i) => {
            el.style.transitionDelay = `${(i % 6) * 80}ms`;
            observer.observe(el);
        });

        // Close mobile nav on link tap
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                document.getElementById('nav-toggle').checked = false;
            });
        });

        // Hover glow on cards + corrupt color injection
        document.querySelectorAll('.case-card, .note-card, .stack-card, .tl-item').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--glow-x', `${x}%`);
                card.style.setProperty('--glow-y', `${y}%`);
                const distX = Math.abs(x - 50) / 50;
                const distY = Math.abs(y - 50) / 50;
                const corruptIntensity = Math.max(distX, distY);
                card.style.setProperty('--corrupt-intensity', corruptIntensity.toFixed(2));
            });
        });

        // Corrupt orange flash on card hover
        document.querySelectorAll('.case-card, .note-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('corrupt-flash');
                setTimeout(() => card.classList.remove('corrupt-flash'), 80);
            });
        });

        // Glitch burst on hero title — randomized 5–8s intervals
        const heroTitle = document.querySelector('[data-glitch="hero-title"]');
        function scheduleHeroGlitch() {
            const delay = 5000 + Math.random() * 3000;
            setTimeout(() => {
                if (heroTitle) {
                    heroTitle.classList.add('is-glitching');
                    setTimeout(() => {
                        heroTitle.classList.remove('is-glitching');
                        scheduleHeroGlitch();
                    }, 450);
                }
            }, delay);
        }
        if (heroTitle) scheduleHeroGlitch();

        // Glitch burst on contact title — fixed 4s intervals
        const contactTitle = document.querySelector('[data-glitch="contact-title"]');
        if (contactTitle) {
            setInterval(() => {
                contactTitle.classList.add('is-glitching');
                setTimeout(() => contactTitle.classList.remove('is-glitching'), 380);
            }, 4000);
        }
