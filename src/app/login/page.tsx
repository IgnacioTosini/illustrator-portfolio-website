import './_login.scss';

interface Props {
    searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
    const { error } = await searchParams;

    return (
        <main className="loginContainer">
            <h1>Acceso Dashboard</h1>

            <form action="/api/auth/login" method="POST" className="loginForm">
                <input
                    type="password"
                    name="key"
                    placeholder="Clave de acceso"
                    required
                />
                <button type="submit" className="submitButton">Entrar</button>
            </form>

            {error && <p className="error-message">Clave incorrecta</p>}
        </main>
    );
}