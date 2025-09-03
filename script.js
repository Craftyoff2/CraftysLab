            function toggleRules() {
                const rules = document.getElementById('dd-rules');
                const arrow = document.getElementById('arrow-icon');
                if (rules.classList.contains('open')) {
                    rules.classList.remove('open');
                    arrow.style.transform = 'rotate(0deg)';
                } else {
                    rules.classList.add('open');
                    arrow.style.transform = 'rotate(180deg)';
                }
            }
