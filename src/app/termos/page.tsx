'use client';

export default function Termos() {
  return (
    <>
      <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
            Termos de Uso - Tech Money
          </h1>

          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                1. Aceitação dos Termos
              </h2>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                Ao acessar e usar o Tech Money, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                2. Uso do Serviço
              </h2>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                O Tech Money é uma plataforma de controle financeiro pessoal. Você é responsável por manter a confidencialidade de suas credenciais e por todas as atividades que ocorrem em sua conta.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                3. Privacidade e Segurança
              </h2>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                Nós nos comprometemos a proteger suas informações pessoais. Todas as informações financeiras são armazenadas de forma segura e não serão compartilhadas com terceiros sem sua autorização.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                4. Responsabilidades do Usuário
              </h2>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                Você é responsável por fornecer informações precisas e atualizadas. O Tech Money não se responsabiliza por decisões financeiras tomadas com base nas informações fornecidas pela plataforma.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                5. Modificações nos Termos
              </h2>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                Reservamos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas aos usuários através do aplicativo ou por e-mail.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                6. Contato
              </h2>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                Para qualquer dúvida sobre estes termos, entre em contato conosco através do e-mail: suporte@techmoney.com.br
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
