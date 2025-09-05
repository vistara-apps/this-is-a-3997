export const scripts = [
  {
    id: '1',
    title: 'Traffic Stop Script',
    scenario: 'Being pulled over during a traffic stop',
    language: 'English',
    preview: 'Good evening, officer. I am going to remain silent and...',
    content: `
**Initial Contact:**
"Good evening, officer. I understand you've pulled me over. I am going to exercise my right to remain silent."

**When Asked for Documents:**
"I will provide my license, registration, and insurance. Here they are."

**If Asked Questions:**
"I am exercising my right to remain silent. I do not wish to answer any questions."

**If Asked to Search:**
"I do not consent to any searches of my person or vehicle."

**If Asked to Exit Vehicle:**
"I will comply with your lawful order, but I want to make it clear that I do not consent to any searches."

**Ending the Stop:**
"Am I free to go now, officer?"

**Remember:**
- Keep hands visible at all times
- Remain calm and polite
- Do not argue or become confrontational
- Comply with lawful orders while asserting rights
    `,
    premium: false,
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Police Questioning Script',
    scenario: 'Being questioned by police',
    language: 'English',
    preview: 'I am invoking my right to remain silent and...',
    content: `
**Initial Response:**
"I am invoking my right to remain silent and my right to speak with an attorney."

**If Questioning Continues:**
"I have invoked my rights. I will not answer any questions without my attorney present."

**If Pressured:**
"I understand you may have questions, but I am exercising my constitutional rights."

**Requesting Attorney:**
"I want to speak with an attorney before answering any questions."

**If Offered Deal/Leniency:**
"I cannot make any decisions without speaking to my attorney first."

**If Told Attorney Not Needed:**
"I am still requesting an attorney before any questioning."

**Staying Consistent:**
"I am invoking my right to remain silent and will not answer questions without my attorney."

**Important Notes:**
- Say this clearly and unambiguously
- Repeat as necessary
- Do not engage in casual conversation
- Wait for your attorney
    `,
    premium: false,
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '3',
    title: 'Search Refusal Script',
    scenario: 'When police ask to search',
    language: 'English',
    preview: 'I do not consent to any searches of my person...',
    content: `
**Clear Refusal:**
"I do not consent to any searches of my person, belongings, or property."

**If Asked Again:**
"I have clearly stated I do not consent to any searches."

**If Told It's Routine:**
"I understand, but I still do not consent to any searches."

**If Threatened with Warrant:**
"If you need to get a warrant, please do so. I still do not consent."

**If Told Nothing to Hide:**
"Whether or not I have anything to hide, I do not consent to searches."

**Documenting:**
"I want to make it clear for any recording that I do not consent to searches."

**If Search Happens Anyway:**
"I am not resisting, but I want it noted that I do not consent to this search."

**Important Reminders:**
- Never physically resist
- Be clear and consistent
- Repeat as necessary
- Document or remember details
- Do not let them search "just a little"
    `,
    premium: false,
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '4',
    title: 'Script de Parada de Tráfico',
    scenario: 'Ser detenido durante una parada de tráfico',
    language: 'Spanish',
    preview: 'Buenas tardes, oficial. Voy a ejercer mi derecho...',
    content: `
**Contacto Inicial:**
"Buenas tardes, oficial. Entiendo que me ha detenido. Voy a ejercer mi derecho a permanecer en silencio."

**Cuando Se Pidan Documentos:**
"Voy a proporcionar mi licencia, registro y seguro. Aquí están."

**Si Se Hacen Preguntas:**
"Estoy ejerciendo mi derecho a permanecer en silencio. No deseo responder ninguna pregunta."

**Si Se Pide Registrar:**
"No consiento a ningún registro de mi persona o vehículo."

**Si Se Pide Salir del Vehículo:**
"Voy a cumplir con su orden legal, pero quiero dejar claro que no consiento a ningún registro."

**Terminando la Parada:**
"¿Soy libre de irme ahora, oficial?"

**Recordar:**
- Mantener las manos visibles en todo momento
- Permanecer calmado y educado
- No discutir o volverse confrontativo
- Cumplir con órdenes legales mientras se ejercen los derechos
    `,
    premium: true,
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '5',
    title: 'Script de Interrogatorio Policial',
    scenario: 'Ser interrogado por la policía',
    language: 'Spanish',
    preview: 'Estoy invocando mi derecho a permanecer en silencio...',
    content: `
**Respuesta Inicial:**
"Estoy invocando mi derecho a permanecer en silencio y mi derecho a hablar con un abogado."

**Si Continúa el Interrogatorio:**
"He invocado mis derechos. No responderé ninguna pregunta sin la presencia de mi abogado."

**Si Hay Presión:**
"Entiendo que puede tener preguntas, pero estoy ejerciendo mis derechos constitucionales."

**Solicitando Abogado:**
"Quiero hablar con un abogado antes de responder cualquier pregunta."

**Si Se Ofrece Trato/Clemencia:**
"No puedo tomar ninguna decisión sin hablar primero con mi abogado."

**Si Se Dice Que No Necesita Abogado:**
"Aún así solicito un abogado antes de cualquier interrogatorio."

**Manteniéndose Consistente:**
"Estoy invocando mi derecho a permanecer en silencio y no responderé preguntas sin mi abogado."

**Notas Importantes:**
- Decir esto clara e inequívocamente
- Repetir según sea necesario
- No participar en conversación casual
- Esperar a su abogado
    `,
    premium: true,
    updatedAt: '2024-01-15T10:00:00Z'
  }
]