// ==========================================
// 1. TEMA OSCURO (DARK MODE)
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

if (themeToggleBtn) {
    if (document.documentElement.classList.contains('dark')) {
        if (themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden');
    } else {
        if (themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden');
    }

    themeToggleBtn.addEventListener('click', function () {
        if (themeToggleDarkIcon) themeToggleDarkIcon.classList.toggle('hidden');
        if (themeToggleLightIcon) themeToggleLightIcon.classList.toggle('hidden');

        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

window.addEventListener('beforeprint', () => {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-tema-temporal', 'true');
    }
});
window.addEventListener('afterprint', () => {
    if (document.documentElement.getAttribute('data-tema-temporal') === 'true') {
        document.documentElement.classList.add('dark');
        document.documentElement.removeAttribute('data-tema-temporal');
    }
});

// ==========================================
// 2. MENÚ MÓVIL (HAMBURGUESA)
// ==========================================
const btnMenuMovil = document.getElementById('btn-menu-movil');
const menuMovil = document.getElementById('menu-movil');

if (btnMenuMovil && menuMovil) {
    btnMenuMovil.addEventListener('click', () => {
        menuMovil.classList.toggle('hidden');
    });
}

// ==========================================
// 3. LÓGICA DE CÁLCULO SALARIAL
// ==========================================
const formatoDinero = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const formCalculadora = document.getElementById('calcForm');

if (formCalculadora) {
    formCalculadora.addEventListener('submit', function (e) {
        e.preventDefault();

        const salario = parseFloat(document.getElementById('salario').value);
        const tiempo = document.getElementById('tiempo').value;
        const fechaInicio = new Date(document.getElementById('fechaInicio').value);
        const hoy = new Date();

        if (fechaInicio > hoy) {
            alert("La fecha de inicio no puede ser mayor a la fecha actual.");
            return;
        }

        const salarioDiario = salario / 30;
        const salarioHora = salarioDiario / 8; 

        const heDiurna = salarioHora * 2.00;
        const heNocturna = salarioHora * 2.25;
        const heLibreDiurna = salarioHora * 1.50;
        const heLibreNocturna = salarioHora * 1.75;

        const salarioISSS = Math.min(salario, 1000);
        const isss = salarioISSS * 0.03;
        const isssPatronal = salarioISSS * 0.075;

        const salarioAFP = Math.min(salario, 7045.06);
        const afp = salarioAFP * 0.0725;
        const afpPatronal = salarioAFP * 0.0875;

        const salarioGravado = salario - isss - afp;
        let renta = 0;

        if (salarioGravado > 0.01 && salarioGravado <= 472.00) {
            renta = 0;
        } else if (salarioGravado >= 472.01 && salarioGravado <= 895.24) {
            renta = ((salarioGravado - 472.00) * 0.10) + 17.67;
        } else if (salarioGravado >= 895.25 && salarioGravado <= 2038.10) {
            renta = ((salarioGravado - 895.24) * 0.20) + 60.00;
        } else if (salarioGravado >= 2038.11) {
            renta = ((salarioGravado - 2038.10) * 0.30) + 288.57;
        }

        const descuentosMensuales = isss + afp + renta;
        const liquidoMensual = salario - descuentosMensuales;

        const isssQ = isss / 2;
        const afpQ = afp / 2;
        const rentaQ = renta / 2;
        const descQ = descuentosMensuales / 2;
        const liquidoQ = liquidoMensual / 2;

        const cuotaDiaria = salario / 30;
        let aguinaldoBruto = 0;
        let diasAguinaldo = 0;
        let notaAguinaldo = "";

        if (tiempo === "menos_1") {
            const diffTime = Math.abs(hoy - fechaInicio);
            const diasTrabajados = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diasCalculo = Math.min(diasTrabajados, 365);
            aguinaldoBruto = (cuotaDiaria * 15 / 365) * diasCalculo;
            notaAguinaldo = `Proporcional (${diasCalculo} días)`;
        } else {
            if (tiempo === "1_a_3") diasAguinaldo = 15;
            else if (tiempo === "3_a_10") diasAguinaldo = 19;
            else if (tiempo === "10_mas") diasAguinaldo = 21;

            aguinaldoBruto = cuotaDiaria * diasAguinaldo;
            notaAguinaldo = `Correspondiente a ${diasAguinaldo} días`;
        }

        const pagoVacacion15Dias = cuotaDiaria * 15;
        const primaVacacion = pagoVacacion15Dias * 0.30;
        const vacacionTotalBruta = pagoVacacion15Dias + primaVacacion;
        const quincena25 = salario / 2;

        const resultados = document.getElementById('resultados');
        if(resultados) {
            resultados.classList.remove('hidden');
            resultados.classList.remove('animate-fade-in-up');
            void resultados.offsetWidth;
            resultados.classList.add('animate-fade-in-up');
        }

        document.getElementById('r_diario').textContent = formatoDinero.format(salarioDiario);
        document.getElementById('r_hora').textContent = formatoDinero.format(salarioHora);
        document.getElementById('r_he_diurna').textContent = formatoDinero.format(heDiurna);
        document.getElementById('r_he_nocturna').textContent = formatoDinero.format(heNocturna);
        document.getElementById('r_he_libre_diurna').textContent = formatoDinero.format(heLibreDiurna);
        document.getElementById('r_he_libre_nocturna').textContent = formatoDinero.format(heLibreNocturna);

        document.getElementById('r_bruto_m').textContent = formatoDinero.format(salario);
        document.getElementById('r_isss_m').textContent = '-' + formatoDinero.format(isss);
        document.getElementById('r_afp_m').textContent = '-' + formatoDinero.format(afp);
        document.getElementById('r_renta_m').textContent = '-' + formatoDinero.format(renta);
        document.getElementById('r_desc_m').textContent = '-' + formatoDinero.format(descuentosMensuales);
        document.getElementById('r_liquido_m').textContent = formatoDinero.format(liquidoMensual);

        document.getElementById('r_bruto_q').textContent = formatoDinero.format(salario / 2);
        document.getElementById('r_isss_q').textContent = '-' + formatoDinero.format(isssQ);
        document.getElementById('r_afp_q').textContent = '-' + formatoDinero.format(afpQ);
        document.getElementById('r_renta_q').textContent = '-' + formatoDinero.format(rentaQ);
        document.getElementById('r_desc_q').textContent = '-' + formatoDinero.format(descQ);
        document.getElementById('r_liquido_q').textContent = formatoDinero.format(liquidoQ);

        document.getElementById('r_isss_pat').textContent = formatoDinero.format(isssPatronal);
        document.getElementById('r_afp_pat').textContent = formatoDinero.format(afpPatronal);
        document.getElementById('nota_aguinaldo').textContent = notaAguinaldo;
        document.getElementById('r_aguinaldo').textContent = formatoDinero.format(aguinaldoBruto);
        document.getElementById('r_vacacion').textContent = formatoDinero.format(vacacionTotalBruta);
        document.getElementById('r_q25').textContent = formatoDinero.format(quincena25);

        const fechaInput = document.getElementById('fechaInicio').value;
        if (fechaInput) {
            const partes = fechaInput.split('-');
            document.getElementById('print_fecha_ingreso').textContent = `${partes[2]}/${partes[1]}/${partes[0]}`;
        } else {
            document.getElementById('print_fecha_ingreso').textContent = "No especificada";
        }

        const fechaImpresion = hoy.toLocaleDateString('es-SV', { day: 'numeric', month: 'numeric', year: '2-digit' });
        const horaImpresion = hoy.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit', hour12: false });
        document.getElementById('print_datetime').textContent = `${fechaImpresion}, ${horaImpresion}`;
    });
}

// ==========================================
// 4. ENVÍO DE FORMULARIO DE CONTACTO
// ==========================================
const formContacto = document.getElementById('form-contacto');
const mensajeExito = document.getElementById('mensaje-exito');
const btnNuevoMensaje = document.getElementById('btn-nuevo-mensaje');

if (formContacto) {
    formContacto.addEventListener('submit', function(e) {
        e.preventDefault(); 
        e.stopPropagation(); 

        const btnSubmit = formContacto.querySelector('button[type="submit"]');
        const originalText = btnSubmit.innerHTML;
        
        btnSubmit.innerHTML = '<i class="bi bi-hourglass-split animate-spin"></i> Enviando...';
        btnSubmit.disabled = true;

        const formData = new FormData(formContacto);
        const data = new URLSearchParams();
        for (const pair of formData) {
            data.append(pair[0], pair[1]);
        }

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: data.toString()
        })
        .then(response => {
            if (response.ok) {
                formContacto.classList.add('hidden');
                if (mensajeExito) {
                    mensajeExito.classList.remove('hidden');
                    mensajeExito.classList.add('flex');
                    setTimeout(() => {
                        mensajeExito.classList.remove('opacity-0', 'scale-95');
                        mensajeExito.classList.add('opacity-100', 'scale-100');
                    }, 50);
                }
                formContacto.reset();
            } else {
                throw new Error("Error en la respuesta de Netlify");
            }
        })
        .catch(() => {
            alert('Hubo un problema de conexión al enviar el mensaje. Por favor, intenta de nuevo.');
        })
        .finally(() => {
            btnSubmit.innerHTML = originalText;
            btnSubmit.disabled = false;
        });
    });
}

if (btnNuevoMensaje) {
    btnNuevoMensaje.addEventListener('click', () => {
        if (mensajeExito) {
            mensajeExito.classList.add('hidden', 'opacity-0', 'scale-95');
            mensajeExito.classList.remove('flex', 'opacity-100', 'scale-100');
        }
        if (formContacto) {
            formContacto.classList.remove('hidden');
        }
    });
}

// ==========================================
// 5. BANNER DE COOKIES (AdSense)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const cookieBanner = document.getElementById('cookie-banner');
    const btnAcceptCookies = document.getElementById('btn-accept-cookies');

    if (cookieBanner) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.remove('translate-y-full');
            }, 1000); 
        }
        if (btnAcceptCookies) {
            btnAcceptCookies.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieBanner.classList.add('translate-y-full');
            });
        }
    }
});