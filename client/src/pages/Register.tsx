import Layout from '@layout/PagesLayout';

// Componente de Registro
const Register = () => {
    // TODO: Verificar se o usuário está logado
    // Caso o usuário esteja logado, redirecionar para a página PERFIL
    // Utilize o Redux existente para determinar o estado de login do usuário.

    // TODO: Implementar tratamento de erros no front-end
    // Utilize Zod schema para validar os dados do formulário.

    // TODO: Implementar lógica do formulário
    // Utilize o hook useForm para gerenciar o estado e a validação dos campos do formulário.

    // TODO: Enviar dados para a API
    // Use Axios para realizar a requisição ao backend.

    // TODO: Definir os campos do formulário
    // Os campos necessários são:
    // - Email
    // - Nome completo
    // - Senha (deve ter no mínimo 8 caracteres, conter números, letras maiúsculas e minúsculas, e caracteres especiais)
    // - Confirmar senha

    // TODO: Retornar erros individualmente
    // Cada campo deve retornar erros de validação imediatamente após a interação do usuário.

    // TODO: Notificações
    // Se a requisição for bem-sucedida (status 201), gerar uma notificação de sucesso usando Toast.
    // Caso contrário, exibir uma notificação de erro retornada pelo servidor.

    // TODO: Usar o formulário de exemplo 'formSign' como referência.

    return (
        <Layout title='Formulário de Registro'>
            {/* Aqui você pode adicionar o JSX do formulário de registro */}
            {/* Por exemplo: */}
            <h1>Registro de Usuário</h1>
            {/* Adicione o componente do formulário aqui */}
            <p>Aqui ficará o formulário para registro.</p>
        </Layout>
    );
};

export default Register;
