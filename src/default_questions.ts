import { Question } from './types';

export const DEFAULT_QUESTIONS: Question[] = [
  // 1. DEMANDA DE TRABALHO
  {
    id: 'q1_1',
    section_id: 1,
    section_title: '1. DEMANDA DE TRABALHO (KARASEK/HSE)',
    text: 'O volume de trabalho é excessivo?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q1_2',
    section_id: 1,
    section_title: '1. DEMANDA DE TRABALHO (KARASEK/HSE)',
    text: 'Existem prazos muito apertados?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q1_3',
    section_id: 1,
    section_title: '1. DEMANDA DE TRABALHO (KARASEK/HSE)',
    text: 'O trabalhador precisa realizar várias tarefas simultaneamente?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q1_4',
    section_id: 1,
    section_title: '1. DEMANDA DE TRABALHO (KARASEK/HSE)',
    text: 'Há pressão constante por produtividade?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q1_5',
    section_id: 1,
    section_title: '1. DEMANDA DE TRABALHO (KARASEK/HSE)',
    text: 'O ritmo de trabalho é intenso?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q1_6',
    section_id: 1,
    section_title: '1. DEMANDA DE TRABALHO (KARASEK/HSE)',
    text: 'O trabalhador leva trabalho para casa?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q1_7',
    section_id: 1,
    section_title: '1. DEMANDA DE TRABALHO (KARASEK/HSE)',
    text: 'O trabalho exige alta concentração por longos períodos?',
    type: 'scale',
    is_inverted: false
  },

  // 2. CONTROLE E AUTONOMIA
  {
    id: 'q2_1',
    section_id: 2,
    section_title: '2. CONTROLE E AUTONOMIA NO TRABALHO',
    text: 'O trabalhador possui autonomia para organizar suas atividades?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q2_2',
    section_id: 2,
    section_title: '2. CONTROLE E AUTONOMIA NO TRABALHO',
    text: 'Pode participar de decisões relacionadas ao seu trabalho?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q2_3',
    section_id: 2,
    section_title: '2. CONTROLE E AUTONOMIA NO TRABALHO',
    text: 'Possui liberdade para resolver problemas?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q2_4',
    section_id: 2,
    section_title: '2. CONTROLE E AUTONOMIA NO TRABALHO',
    text: 'Recebe treinamento adequado para executar as tarefas?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q2_5',
    section_id: 2,
    section_title: '2. CONTROLE E AUTONOMIA NO TRABALHO',
    text: 'Tem acesso às informações necessárias para trabalhar?',
    type: 'scale',
    is_inverted: true
  },

  // 3. APOIO DA LIDERANÇA
  {
    id: 'q3_1',
    section_id: 3,
    section_title: '3. APOIO DA LIDERANÇA',
    text: 'O gestor fornece orientação adequada?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q3_2',
    section_id: 3,
    section_title: '3. APOIO DA LIDERANÇA',
    text: 'O trabalhador sente-se apoiado pela liderança?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q3_3',
    section_id: 3,
    section_title: '3. APOIO DA LIDERANÇA',
    text: 'Existe abertura para diálogo?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q3_4',
    section_id: 3,
    section_title: '3. APOIO DA LIDERANÇA',
    text: 'O gestor trata os trabalhadores com respeito?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q3_5',
    section_id: 3,
    section_title: '3. APOIO DA LIDERANÇA',
    text: 'Há reconhecimento pelo trabalho realizado?',
    type: 'scale',
    is_inverted: true
  },

  // 4. RELACIONAMENTO INTERPESSOAL
  {
    id: 'q4_1',
    section_id: 4,
    section_title: '4. RELACIONAMENTO INTERPESSOAL',
    text: 'O ambiente de trabalho é harmonioso?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q4_2',
    section_id: 4,
    section_title: '4. RELACIONAMENTO INTERPESSOAL',
    text: 'Existe cooperação entre colegas?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q4_3',
    section_id: 4,
    section_title: '4. RELACIONAMENTO INTERPESSOAL',
    text: 'Há conflitos frequentes na equipe?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q4_4',
    section_id: 4,
    section_title: '4. RELACIONAMENTO INTERPESSOAL',
    text: 'O trabalhador sente-se integrado ao grupo?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q4_5',
    section_id: 4,
    section_title: '4. RELACIONAMENTO INTERPESSOAL',
    text: 'Existem episódios de discriminação?',
    type: 'scale',
    is_inverted: false
  },

  // 5. ASSÉDIO MORAL E VIOLÊNCIA NO TRABALHO
  {
    id: 'q5_1',
    section_id: 5,
    section_title: '5. ASSÉDIO MORAL E VIOLÊNCIA NO TRABALHO',
    text: 'O trabalhador já sofreu humilhações?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q5_2',
    section_id: 5,
    section_title: '5. ASSÉDIO MORAL E VIOLÊNCIA NO TRABALHO',
    text: 'Recebe críticas excessivas em público?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q5_3',
    section_id: 5,
    section_title: '5. ASSÉDIO MORAL E VIOLÊNCIA NO TRABALHO',
    text: 'Sofre perseguições por superiores?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q5_4',
    section_id: 5,
    section_title: '5. ASSÉDIO MORAL E VIOLÊNCIA NO TRABALHO',
    text: 'Há ameaças relacionadas ao emprego?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q5_5',
    section_id: 5,
    section_title: '5. ASSÉDIO MORAL E VIOLÊNCIA NO TRABALHO',
    text: 'Ocorrem situações de intimidação?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q5_6',
    section_id: 5,
    section_title: '5. ASSÉDIO MORAL E VIOLÊNCIA NO TRABALHO',
    text: 'Há casos de assédio sexual?',
    type: 'scale',
    is_inverted: false
  },

  // 6. RECONHECIMENTO E RECOMPENSA (SIEGRIST)
  {
    id: 'q6_1',
    section_id: 6,
    section_title: '6. RECONHECIMENTO E RECOMPENSA (SIEGRIST)',
    text: 'O trabalhador sente-se valorizado?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q6_2',
    section_id: 6,
    section_title: '6. RECONHECIMENTO E RECOMPENSA (SIEGRIST)',
    text: 'Recebe feedback positivo?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q6_3',
    section_id: 6,
    section_title: '6. RECONHECIMENTO E RECOMPENSA (SIEGRIST)',
    text: 'Existe perspectiva de crescimento?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q6_4',
    section_id: 6,
    section_title: '6. RECONHECIMENTO E RECOMPENSA (SIEGRIST)',
    text: 'A remuneração é percebida como justa?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q6_5',
    section_id: 6,
    section_title: '6. RECONHECIMENTO E RECOMPENSA (SIEGRIST)',
    text: 'Há reconhecimento pelos resultados alcançados?',
    type: 'scale',
    is_inverted: true
  },

  // 7. SEGURANÇA NO EMPREGO
  {
    id: 'q7_1',
    section_id: 7,
    section_title: '7. SEGURANÇA NO EMPREGO',
    text: 'Existe medo de demissão?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q7_2',
    section_id: 7,
    section_title: '7. SEGURANÇA NO EMPREGO',
    text: 'O trabalhador percebe estabilidade?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q7_3',
    section_id: 7,
    section_title: '7. SEGURANÇA NO EMPREGO',
    text: 'Existem mudanças organizacionais frequentes?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q7_4',
    section_id: 7,
    section_title: '7. SEGURANÇA NO EMPREGO',
    text: 'Há insegurança sobre o futuro profissional?',
    type: 'scale',
    is_inverted: false
  },

  // 8. EQUILÍBRIO TRABALHO X VIDA PESSOAL
  {
    id: 'q8_1',
    section_id: 8,
    section_title: '8. EQUILÍBRIO TRABALHO X VIDA PESSOAL',
    text: 'O trabalho interfere na vida familiar?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q8_2',
    section_id: 8,
    section_title: '8. EQUILÍBRIO TRABALHO X VIDA PESSOAL',
    text: 'O trabalhador consegue descansar adequadamente?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q8_3',
    section_id: 8,
    section_title: '8. EQUILÍBRIO TRABALHO X VIDA PESSOAL',
    text: 'Existem jornadas excessivas?',
    type: 'scale',
    is_inverted: false
  },
  {
    id: 'q8_4',
    section_id: 8,
    section_title: '8. EQUILÍBRIO TRABALHO X VIDA PESSOAL',
    text: 'O trabalhador consegue usufruir férias e folgas?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q8_5',
    section_id: 8,
    section_title: '8. EQUILÍBRIO TRABALHO X VIDA PESSOAL',
    text: 'Há dificuldades para conciliar demandas pessoais e profissionais?',
    type: 'scale',
    is_inverted: false
  },

  // 9. COMUNICAÇÃO ORGANIZACIONAL
  {
    id: 'q9_1',
    section_id: 9,
    section_title: '9. COMUNICAÇÃO ORGANIZACIONAL',
    text: 'As informações são transmitidas com clareza?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q9_2',
    section_id: 9,
    section_title: '9. COMUNICAÇÃO ORGANIZACIONAL',
    text: 'Os objetivos da empresa são conhecidos?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q9_3',
    section_id: 9,
    section_title: '9. COMUNICAÇÃO ORGANIZACIONAL',
    text: 'O trabalhador recebe retorno sobre seu desempenho?',
    type: 'scale',
    is_inverted: true
  },
  {
    id: 'q9_4',
    section_id: 9,
    section_title: '9. COMUNICAÇÃO ORGANIZACIONAL',
    text: 'Mudanças organizacionais são comunicadas adequadamente?',
    type: 'scale',
    is_inverted: true
  },

  // 10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL
  {
    id: 'q10_1',
    section_id: 10,
    section_title: '10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL',
    text: 'Cansaço excessivo',
    type: 'boolean',
    is_inverted: false
  },
  {
    id: 'q10_2',
    section_id: 10,
    section_title: '10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL',
    text: 'Insônia',
    type: 'boolean',
    is_inverted: false
  },
  {
    id: 'q10_3',
    section_id: 10,
    section_title: '10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL',
    text: 'Irritabilidade',
    type: 'boolean',
    is_inverted: false
  },
  {
    id: 'q10_4',
    section_id: 10,
    section_title: '10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL',
    text: 'Ansiedade',
    type: 'boolean',
    is_inverted: false
  },
  {
    id: 'q10_5',
    section_id: 10,
    section_title: '10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL',
    text: 'Dificuldade de concentração',
    type: 'boolean',
    is_inverted: false
  },
  {
    id: 'q10_6',
    section_id: 10,
    section_title: '10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL',
    text: 'Desmotivação',
    type: 'boolean',
    is_inverted: false
  },
  {
    id: 'q10_7',
    section_id: 10,
    section_title: '10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL',
    text: 'Dores musculares frequentes',
    type: 'boolean',
    is_inverted: false
  },
  {
    id: 'q10_8',
    section_id: 10,
    section_title: '10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL',
    text: 'Cefaleias recorrentes',
    type: 'boolean',
    is_inverted: false
  },
  {
    id: 'q10_9',
    section_id: 10,
    section_title: '10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL',
    text: 'Sintomas depressivos',
    type: 'boolean',
    is_inverted: false
  },
  {
    id: 'q10_10',
    section_id: 10,
    section_title: '10. SINTOMAS RELACIONADOS AO ESTRESSE OCUPACIONAL',
    text: 'Uso frequente de medicamentos para ansiedade ou sono',
    type: 'boolean',
    is_inverted: false
  }
];
