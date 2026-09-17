/* =========================
   CONFIGURAÇÕES
========================= */

// WhatsApp do Studio
// 55 = Brasil
// 83 = DDD
const numeroWhatsApp = "558399999999";


// Para aulas no mesmo dia:
// depois das 15h não é possível solicitar.
const horaLimiteMesmoDia = 15;


/* =========================
   ELEMENTOS
========================= */

const btnAula =
    document.getElementById("btnAula");

const btnDuvida =
    document.getElementById("btnDuvida");

const formAula =
    document.getElementById("formAula");

const formDuvida =
    document.getElementById("formDuvida");

const nomeAula =
    document.getElementById("nomeAula");

const nomeDuvida =
    document.getElementById("nomeDuvida");

const dataAula =
    document.getElementById("dataAula");

const botoesHorario =
    document.querySelectorAll(
        "#horariosAgendamento button"
    );

const avisoAgendamento =
    document.getElementById(
        "avisoAgendamento"
    );

const enviarAula =
    document.getElementById(
        "enviarAula"
    );

const enviarDuvida =
    document.getElementById(
        "enviarDuvida"
    );


let horarioSelecionado = null;


/* =========================
   OBTER DATA LOCAL
========================= */

function obterDataLocal() {

    const agora = new Date();

    const ano =
        agora.getFullYear();

    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            agora.getDate()
        ).padStart(2, "0");


    return `${ano}-${mes}-${dia}`;

}


/* =========================
   DATA MÍNIMA
========================= */

dataAula.min =
    obterDataLocal();


/* =========================
   VERIFICAR EXPEDIENTE
========================= */

function verificarExpediente() {

    const agora =
        new Date();

    const diaSemana =
        agora.getDay();

    const horaAtual =
        agora.getHours();

    const minutoAtual =
        agora.getMinutes();


    const minutosAgora =
        (horaAtual * 60) +
        minutoAtual;


    /*
        Domingo = 0
        Segunda = 1
        Terça = 2
        Quarta = 3
        Quinta = 4
        Sexta = 5
        Sábado = 6
    */


    /* =========================
       SÁBADO E DOMINGO
    ========================== */

    if (
        diaSemana === 0 ||
        diaSemana === 6
    ) {

        return {

            aberto: false,

            mensagem:
                "Agendamentos e dúvidas são atendidos de segunda a sexta-feira durante o horário comercial."

        };

    }


    /* =========================
       SEGUNDA E QUARTA

       Expediente:
       07:00 às 20:00

       Solicitações:
       07:00 às 19:00
    ========================== */

    if (
        diaSemana === 1 ||
        diaSemana === 3
    ) {

        const abertura =
            7 * 60;

        const limite =
            19 * 60;


        if (
            minutosAgora < abertura ||
            minutosAgora >= limite
        ) {

            return {

                aberto: false,

                mensagem:
                    "Agendamentos e dúvidas são atendidos das 07:00 às 19:00."

            };

        }


        return {

            aberto: true,

            mensagem: ""

        };

    }


    /* =========================
       TERÇA, QUINTA E SEXTA

       Expediente:
       07:00 às 18:00

       Solicitações:
       07:00 às 17:00
    ========================== */

    if (
        diaSemana === 2 ||
        diaSemana === 4 ||
        diaSemana === 5
    ) {

        const abertura =
            7 * 60;

        const limite =
            17 * 60;


        if (
            minutosAgora < abertura ||
            minutosAgora >= limite
        ) {

            return {

                aberto: false,

                mensagem:
                    "Agendamentos e dúvidas são atendidos hoje das 07:00 às 17:00."

            };

        }


        return {

            aberto: true,

            mensagem: ""

        };

    }


    return {

        aberto: false,

        mensagem:
            "Agendamentos e dúvidas estão indisponíveis no momento."

    };

}


/* =========================
   STATUS DO ATENDIMENTO
========================= */

function atualizarStatusAtendimento() {

    const expediente =
        verificarExpediente();


    enviarAula.disabled =
        !expediente.aberto;

    enviarDuvida.disabled =
        !expediente.aberto;


    /* =========================
       FORA DO EXPEDIENTE
    ========================== */

    if (!expediente.aberto) {

        enviarAula.textContent =
            "Atendimento indisponível no momento";

        enviarDuvida.textContent =
            "Atendimento indisponível no momento";


        /*
            Só mostramos esse aviso
            no formulário de aula.

            Na opção dúvida o botão
            também permanece bloqueado.
        */

        if (
            !formAula.classList.contains(
                "escondido"
            )
        ) {

            avisoAgendamento.innerHTML =
                `<strong>Atendimento pelo WhatsApp encerrado no momento.</strong><br>
                ${expediente.mensagem}<br>
                Retorne durante nosso horário de atendimento.`;

        }

    }


    /* =========================
       DENTRO DO EXPEDIENTE
    ========================== */

    else {

        enviarAula.textContent =
            "Solicitar aula pelo WhatsApp";

        enviarDuvida.textContent =
            "Falar pelo WhatsApp";


        if (
            !dataAula.value &&
            !formAula.classList.contains(
                "escondido"
            )
        ) {

            avisoAgendamento.textContent =
                "Escolha primeiro o dia da aula.";

        }

    }

}


/* =========================
   AULA EXPERIMENTAL
========================= */

btnAula.addEventListener(
    "click",
    function () {

        btnAula.classList.add(
            "ativo"
        );

        btnDuvida.classList.remove(
            "ativo"
        );


        formAula.classList.remove(
            "escondido"
        );

        formDuvida.classList.add(
            "escondido"
        );


        atualizarStatusAtendimento();

    }
);


/* =========================
   TIRAR DÚVIDA
========================= */

btnDuvida.addEventListener(
    "click",
    function () {

        btnDuvida.classList.add(
            "ativo"
        );

        btnAula.classList.remove(
            "ativo"
        );


        formDuvida.classList.remove(
            "escondido"
        );

        formAula.classList.add(
            "escondido"
        );


        atualizarStatusAtendimento();

    }
);


/* =========================
   DESABILITAR HORÁRIOS
========================= */

function desabilitarTodosHorarios() {

    botoesHorario.forEach(
        function (botao) {

            botao.disabled = true;

            botao.classList.remove(
                "selecionado"
            );

        }
    );


    horarioSelecionado = null;

}


/* =========================
   DIA DA SEMANA DA DATA
========================= */

function obterDiaSemana(
    dataSelecionada
) {

    const partes =
        dataSelecionada.split("-");


    const ano =
        Number(
            partes[0]
        );

    const mes =
        Number(
            partes[1]
        ) - 1;

    const dia =
        Number(
            partes[2]
        );


    const data =
        new Date(
            ano,
            mes,
            dia
        );


    return data.getDay();

}


/* =========================
   ATUALIZAR HORÁRIOS
========================= */

function atualizarHorarios() {

    horarioSelecionado = null;


    botoesHorario.forEach(
        function (botao) {

            botao.disabled = false;

            botao.classList.remove(
                "selecionado"
            );

        }
    );


    /* =========================
       NENHUMA DATA
    ========================== */

    if (!dataAula.value) {

        desabilitarTodosHorarios();


        avisoAgendamento.textContent =
            "Escolha primeiro o dia da aula.";


        atualizarStatusAtendimento();

        return;

    }


    const hoje =
        obterDataLocal();


    /* =========================
       DATA PASSADA
    ========================== */

    if (
        dataAula.value <
        hoje
    ) {

        desabilitarTodosHorarios();


        avisoAgendamento.textContent =
            "Não é possível solicitar uma aula para uma data que já passou.";


        return;

    }


    /* =========================
       SÁBADO E DOMINGO
    ========================== */

    const diaSemana =
        obterDiaSemana(
            dataAula.value
        );


    if (
        diaSemana === 0 ||
        diaSemana === 6
    ) {

        desabilitarTodosHorarios();


        avisoAgendamento.textContent =
            "Não realizamos atendimentos aos sábados e domingos. Escolha um dia de segunda a sexta-feira.";


        return;

    }


    /* =========================
       DATA FUTURA
    ========================== */

    if (
        dataAula.value !==
        hoje
    ) {

        avisoAgendamento.textContent =
            "Selecione um dos horários disponíveis.";


        /*
            Mesmo escolhendo amanhã
            ou outro dia, o envio só
            funciona durante o expediente.
        */

        atualizarStatusAtendimento();

        return;

    }


    /* =========================
       AGENDAMENTO PARA HOJE
    ========================== */

    const agora =
        new Date();

    const horaAtual =
        agora.getHours();

    const minutoAtual =
        agora.getMinutes();


    /* =========================
       LIMITE DAS 15H
    ========================== */

    if (
        horaAtual >=
        horaLimiteMesmoDia
    ) {

        desabilitarTodosHorarios();


        avisoAgendamento.textContent =
            "As solicitações para hoje encerraram às 15h. Escolha outro dia.";


        return;

    }


    /* =========================
       UMA HORA DE ANTECEDÊNCIA
    ========================== */

    const agoraEmMinutos =
        (horaAtual * 60) +
        minutoAtual;


    const minimoPermitido =
        agoraEmMinutos + 60;


    botoesHorario.forEach(
        function (botao) {

            const horario =
                botao.dataset.hora;


            const partes =
                horario.split(":");


            const horaBotao =
                Number(
                    partes[0]
                );

            const minutoBotao =
                Number(
                    partes[1]
                );


            const horarioEmMinutos =
                (horaBotao * 60) +
                minutoBotao;


            if (
                horarioEmMinutos <
                minimoPermitido
            ) {

                botao.disabled = true;

            }

        }
    );


    /* =========================
       EXISTE HORÁRIO?
    ========================== */

    const existeHorarioDisponivel =
        Array.from(
            botoesHorario
        ).some(
            function (botao) {

                return !botao.disabled;

            }
        );


    if (
        !existeHorarioDisponivel
    ) {

        avisoAgendamento.textContent =
            "Não há mais horários disponíveis para hoje. Escolha outro dia.";

    }

    else {

        avisoAgendamento.textContent =
            "Horários indisponíveis aparecem bloqueados.";

    }


    atualizarStatusAtendimento();

}


/* =========================
   ALTERAR DATA
========================= */

dataAula.addEventListener(
    "change",
    atualizarHorarios
);


/* =========================
   SELECIONAR HORÁRIO
========================= */

botoesHorario.forEach(
    function (botao) {

        botao.addEventListener(
            "click",
            function () {

                if (
                    botao.disabled
                ) {

                    return;

                }


                botoesHorario.forEach(
                    function (item) {

                        item.classList.remove(
                            "selecionado"
                        );

                    }
                );


                botao.classList.add(
                    "selecionado"
                );


                horarioSelecionado =
                    botao.dataset.hora;


                const expediente =
                    verificarExpediente();


                if (
                    expediente.aberto
                ) {

                    avisoAgendamento.textContent =
                        "Horário selecionado. A confirmação será feita pelo Studio no WhatsApp.";

                }

                else {

                    avisoAgendamento.innerHTML =
                        `<strong>Atendimento pelo WhatsApp encerrado no momento.</strong><br>
                        ${expediente.mensagem}<br>
                        Retorne durante nosso horário de atendimento.`;

                }

            }
        );

    }
);


/* =========================
   FORMATAR DATA
========================= */

function formatarData(data) {

    const partes =
        data.split("-");


    return (
        `${partes[2]}/` +
        `${partes[1]}/` +
        `${partes[0]}`
    );

}


/* =========================
   VALIDAR EXPEDIENTE
========================= */

function validarExpedienteAntesDeEnviar() {

    const expediente =
        verificarExpediente();


    if (
        !expediente.aberto
    ) {

        avisoAgendamento.innerHTML =
            `<strong>Atendimento pelo WhatsApp encerrado no momento.</strong><br>
            ${expediente.mensagem}<br>
            Retorne durante nosso horário de atendimento.`;


        atualizarStatusAtendimento();


        return false;

    }


    return true;

}


/* =========================
   VALIDAR DATA
========================= */

function validarDataAntesDeEnviar() {

    if (
        !dataAula.value
    ) {

        avisoAgendamento.textContent =
            "Escolha o dia da aula.";


        dataAula.focus();


        return false;

    }


    const hoje =
        obterDataLocal();


    /* DATA PASSADA */

    if (
        dataAula.value <
        hoje
    ) {

        avisoAgendamento.textContent =
            "Escolha uma data válida.";


        return false;

    }


    /* FIM DE SEMANA */

    const diaSemana =
        obterDiaSemana(
            dataAula.value
        );


    if (
        diaSemana === 0 ||
        diaSemana === 6
    ) {

        avisoAgendamento.textContent =
            "Não realizamos atendimentos aos sábados e domingos.";


        return false;

    }


    /* =========================
       SE FOR HOJE
    ========================== */

    if (
        dataAula.value ===
        hoje
    ) {

        const agora =
            new Date();


        /* LIMITE DAS 15H */

        if (
            agora.getHours() >=
            horaLimiteMesmoDia
        ) {

            atualizarHorarios();


            avisoAgendamento.textContent =
                "As solicitações para hoje encerraram às 15h. Escolha outro dia.";


            return false;

        }


        /* =========================
           1H DE ANTECEDÊNCIA
        ========================== */

        if (
            horarioSelecionado
        ) {

            const partesHora =
                horarioSelecionado.split(
                    ":"
                );


            const horarioEscolhido =
                (
                    Number(
                        partesHora[0]
                    ) * 60
                )
                +
                Number(
                    partesHora[1]
                );


            const horarioAtual =
                (
                    agora.getHours() *
                    60
                )
                +
                agora.getMinutes();


            if (
                horarioEscolhido <
                horarioAtual + 60
            ) {

                atualizarHorarios();


                avisoAgendamento.textContent =
                    "Esse horário não possui mais 1 hora de antecedência. Escolha outro horário.";


                return false;

            }

        }

    }


    return true;

}


/* =========================
   ENVIAR AULA EXPERIMENTAL
========================= */

enviarAula.addEventListener(
    "click",
    function () {

        /* EXPEDIENTE */

        if (
            !validarExpedienteAntesDeEnviar()
        ) {

            return;

        }


        /* NOME */

        const nome =
            nomeAula.value.trim();


        if (
            !nome
        ) {

            avisoAgendamento.textContent =
                "Digite seu nome.";


            nomeAula.focus();


            return;

        }


        /* DATA */

        if (
            !validarDataAntesDeEnviar()
        ) {

            return;

        }


        /* HORÁRIO */

        if (
            !horarioSelecionado
        ) {

            avisoAgendamento.textContent =
                "Escolha um horário disponível.";


            return;

        }


        const dataFormatada =
            formatarData(
                dataAula.value
            );


        /* =========================
           MENSAGEM DO WHATSAPP
        ========================== */

        const mensagem =
`Olá! 😊 Conheci o Studio Pilates pelo site e gostaria de solicitar uma aula experimental.

👤 Nome: ${nome}
📅 Dia: ${dataFormatada}
🕐 Horário: ${horarioSelecionado}

Gostaria de confirmar se há disponibilidade para esse horário.`;


        const link =
            `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;


        window.open(
            link,
            "_blank",
            "noopener,noreferrer"
        );

    }
);


/* =========================
   ENVIAR DÚVIDA
========================= */

enviarDuvida.addEventListener(
    "click",
    function () {

        /* =========================
           EXPEDIENTE
        ========================== */

        const expediente =
            verificarExpediente();


        if (
            !expediente.aberto
        ) {

            alert(
                "Agendamentos e dúvidas são atendidos somente durante o horário comercial."
            );


            atualizarStatusAtendimento();


            return;

        }


        /* =========================
           NOME
        ========================== */

        const nome =
            nomeDuvida.value.trim();


        if (
            !nome
        ) {

            alert(
                "Digite seu nome."
            );


            nomeDuvida.focus();


            return;

        }


        /* =========================
           MENSAGEM
        ========================== */

        const mensagem =
`Olá! 😊 Meu nome é ${nome}. Conheci o Studio Pilates pelo site. Poderia me passar mais informações?`;


        const link =
            `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;


        window.open(
            link,
            "_blank",
            "noopener,noreferrer"
        );

    }
);


/* =========================
   INICIAR
========================= */

atualizarHorarios();

atualizarStatusAtendimento();


/* =========================
   ATUALIZA A CADA 1 MINUTO
========================= */

setInterval(
    function () {

        atualizarStatusAtendimento();

        /*
            Se a data escolhida for hoje,
            atualiza também os horários
            que passaram.
        */

        if (
            dataAula.value ===
            obterDataLocal()
        ) {

            atualizarHorarios();

        }

    },

    60000
);